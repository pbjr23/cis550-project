echo '/home/ubuntu/instantclient_12_1/' | sudo tee -a /etc/ld.so.conf.d/oracle_instant_client.conf
sudo ldconfig
node app.js
