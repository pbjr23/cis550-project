/**
 * Very simple String-based key/value store interface for
 * instructional purpose.  Supports both singleton and
 * multivalued (set) values for individual keys.
 * (CAVEAT: The two should NEVER be mixed.)
 * 
 * @author Zack Ives, University of Pennsylvania, for NETS 212
 *
 */

(function() {
	var AWS = require('aws-sdk');
	AWS.config.loadFromPath('./config.json');

	if (!AWS.config.credentials || !AWS.config.credentials.accessKeyId)
		throw 'Need to update config.json to specify your access key!';

	var db = new AWS.DynamoDB();

	function keyvaluestore(table) {
		this.inx = -1;
	
		this.LRU = require("lru-cache");
	
		this.cache = this.LRU({ max: 500 });
		
		this.tableName = table;
	};

	// Constructor with local cache and index
	
	/**
	 * Initialize the tables
	 * 
	 */
	keyvaluestore.prototype.init = function(callback) {
		var tableName = this.tableName;
		var initCount = this.initCount;
		var self = this;
		
		db.listTables(function(err, data) {
			if (err) 
				console.log(err, err.stack);
			else {
				console.log("Connected to AWS DynamoDB");
				
				var tables = data.TableNames.toString().split(",");
				console.log("Tables in DynamoDB: " + tables);
				if (tables.indexOf(tableName) == -1) {
					console.log("Need to create table " + tableName);

					var params = {
							AttributeDefinitions: 
								[ /* required */
								  {
									  AttributeName: 'keyword', /* required */
									  AttributeType: 'S' /* required */
								  },
								  {
									  AttributeName: 'inx', /* required */
									  AttributeType: 'N' /* required */
								  }
								  ],
								  KeySchema: 
									  [ /* required */
									    {
									    	AttributeName: 'keyword', /* required */
									    	KeyType: 'HASH' /* required */
									    },
									    {
									    	AttributeName: 'inx', /* required */
									    	KeyType: 'RANGE' /* required */
									    }
									    ],
									    ProvisionedThroughput: { /* required */
									    	ReadCapacityUnits: 1, /* required */
									    	WriteCapacityUnits: 1 /* required */
									    },
									    TableName: tableName /* required */
					};

					db.createTable(params, function(err, data) {
						if (err) 
							console.log(err, err.stack);
						else {
							self.initCount(callback);
						}
					});
				} else {
					self.initCount(callback);
				}
			}
		}
		);
	}

	/**
	 * Gets the count of how many rows are in the table
	 * 
	 */
	keyvaluestore.prototype.initCount = function(whendone) {
		var self = this;
		var params = {
				TableName: self.tableName,
				Select: 'COUNT'
		};
		
		db.scan(params, function(err, data) {
			if (err)
				console.log(err, err.stack);
			else {
				self.inx = data.ScannedCount;

				console.log("Found " + self.inx + " indexed entries in " + self.tableName);
				whendone();
			}
		});

	}

	/**
	 * Get result(s) by key
	 * 
	 * @param search
	 * 
	 * Callback returns a map from names to values
	 */
	keyvaluestore.prototype.get = function(search, callback) {
		var self = this;

		if (self.cache.get(search))
			callback(null, self.cache.get(search));
		else {
			var params = {
					KeyConditions: {
						keyword: {
							ComparisonOperator: 'EQ',
							AttributeValueList: [ { S: search} ]
						}
					},
					TableName: self.tableName,
					AttributesToGet: [ 'value' ]
			};

			db.query(params, function(err, data) {
				if (err || data.Items.length == 0)
					callback(err, null);
				else {
					self.cache.set(search, data.Items[0].value.S);
					callback(err, data.Items[0].value.S);
				}
			});
		}
	};

	/**
	 * Get result(s) by key
	 * 
	 * @param search
	 * 
	 * Callback returns a map from names to values
	 */
	keyvaluestore.prototype.getSet = function(search, callback) {
		var self = this;
		
		if (self.cache.get(search))
			callback(null, self.cache.get(search));
		else {
			var params = {
					KeyConditions: {
						keyword: {
							ComparisonOperator: 'EQ',
							AttributeValueList: [ { S: search} ]
						}
					},
					TableName: self.tableName,
					AttributesToGet: [ 'value' ]
			};

			db.query(params, function(err, data) {
				if (err || data.Items.length == 0)
					callback(err, null);
				else {
					var items = [];
					for (var i = 0; i < data.Items.length; i++) {
						items.push(data.Items[i].value.S);
					}
					self.cache.set(search, items);
					callback(err, items);
				}
			});
		}
	};

	/**
	 * Test if search key has a match
	 * 
	 * @param search
	 * @return
	 */
	keyvaluestore.prototype.exists = function(search, callback) {
		var self = this;
		
		if (self.cache.get(search))
			callback(null, self.cache.get(search));
		else
			module.exports.get(search, function(err, data) {
				if (err)
					callback(err, null);
				else
					callback(err, (data == null) ? false : true);
			});
	};

	/**
	 * Get result set by key prefix
	 * @param search
	 * @return
	 */
	module.exports.getPrefix = function(search, callback) {
		var self = this;
		var params = {
				KeyConditions: {
					keyword: {
						ComparisonOperator: 'BEGINS_WITH',
						AttributeValueList: [ { S: search} ]
					}
				},
				TableName: self.tableName,
				AttributesToGet: [ 'value' ]
		};

		db.query(params, function(err, data) {
			if (err || data.Items.length == 0)
				callback(err, null);
			else {
				var items = [];
				for (var i = 0; i < data.Items.length; i++) {
					items.push(data.Items[i].value.S);
				}
				callback(err, items);
			}
		});
	}

	/**
	 * Add a key/value or key/valueset pair
	 * @param keyword
	 * @param category
	 */
	keyvaluestore.prototype.addToSet = function(keyword, value, callback) {
		var self = this;
		
		self.cache.del(keyword);
		// Array?
		if (value.length) {
			for (var i = 0; i < value.length; i++) {
				var params = {
						Item: {
							"keyword": {
								S: keyword
							},
							"inx": {
								N: self.inx.toString()
							},
							value: { 
								S: value[i]
							}
						},
						TableName: self.tableName,
						ReturnValues: 'NONE'
				};

				db.putItem(params, callback);
				self.inx++;
			}

		} else {
			var params = {
					Item: {
						"keyword": {
							S: keyword
						},
						"inx": {
							N: self.inx.toString()
						},
						value: { 
							S: value
						}
					},
					TableName: self.tableName,
					ReturnValues: 'NONE'
			};

			db.putItem(params, callback);
			self.inx++;
		}		
	};

	/**
	 * Add a singleton value for the keyword
	 * 
	 * @param keyword
	 * @param value
	 */
	keyvaluestore.prototype.put = function(keyword, value, callback) {
		var self = this;
		
		self.cache.del(keyword);
		var params = {
				Item: {
					"keyword": {
						S: keyword
					},
					"inx": {
						N: "0"
					},
					value: { 
						S: value
					}
				},
				TableName: self.tableName,
				ReturnValues: 'NONE'
		};

		db.putItem(params, callback);
		self.inx++;
	};

	keyvaluestore.prototype.test = function() {
		this.getSet('key2', function(err, data) {
			console.log("GET: " + data);
			if (data != 'val2')
				throw "Wrong value";
		});
		this.getSet('keyword', function(err, data) {
			console.log("GET: " + data.length + "... " + data);
			if (data.length != 257)
				throw "Wrong size";
		});
		this.addToSet('test', 'value', function(err, data) {
			if (err) {
				console.log("Error " + err);
			} else {
				this.getSet('test', function(err, data) {
					console.log("ADD-GET: " + data.length + "... " + data);
				});
			}
		});
		this.exists('key2', function(err, data) {
			console.log("EXISTS: " + data);
			if (!data)
				throw "Should exist";
		});
		this.exists('notthere', function(err, data) {
			console.log("EXISTS: " + data);
			if (data)
				throw "Should not exist";
		});
	}

	module.exports = keyvaluestore;
}());