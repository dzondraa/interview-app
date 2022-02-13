npm --prefix "live-interview-service" run start&
npm --prefix "interview-app-client" run start&
cd interview-app-service
cd API
dotnet build
dotnet run&
