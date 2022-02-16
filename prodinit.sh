npm --prefix "live-interview-service" run start&
npm --prefix "interview-app-client" run start&
cd interview-app-service
cd API
dotnet build
dotnet run&
# cd "C:\Program Files\RabbitMQ Server\rabbitmq_server-3.9.13\sbin" 
# ./rabbitmqctl.bat start_app