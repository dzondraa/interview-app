using System;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Collections;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using CloudStorage.RepositoryImplementation;
using System.Text.Json;
using API.Dto;
using CloudStorage.Entities;

namespace API.Messaging
{
    public class InterviewRecieverService : BackgroundService
    {
        private IServiceProvider _sp;
        private ConnectionFactory _factory;
        private IConnection _connection;
        private IModel _channel;

        // initialize the connection, channel and queue 
        // inside the constructor to persist them 
        // for until the service (or the application) runs
        public InterviewRecieverService(IServiceProvider sp)
        {
            _sp = sp;

            _factory = new ConnectionFactory() { HostName = "localhost" };

            _connection = _factory.CreateConnection();

            _channel = _connection.CreateModel();

            _channel.QueueDeclare(
                queue: "interview",
                durable: true,
                exclusive: false,
                autoDelete: false,
                arguments: null);
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            // when the service is stopping
            // dispose these references
            // to prevent leaks
            if (stoppingToken.IsCancellationRequested)
            {
                _channel.Dispose();
                _connection.Dispose();
                return Task.CompletedTask;
            }

            // create a consumer that listens on the channel (queue)
            var consumer = new EventingBasicConsumer(_channel);

            // handle the Received event on the consumer
            // this is triggered whenever a new message
            // is added to the queue by the producer
            consumer.Received += (model, ea) =>
            {
                // read the message bytes
                var body = ea.Body.ToArray();

                // convert back to the original string
                // {index}|SuperHero{10000+index}|Fly,Eat,Sleep,Manga|1|{DateTime.UtcNow.ToLongDateString()}|0|0
                // is received here
                var message = Encoding.UTF8.GetString(body);

                Console.WriteLine(" [x] Received {0}", message);


                Task.Run(() =>
                {
                    // split the incoming message
                    // into chunks which are inserted
                    // into respective columns of the Heroes table
                    var request = JsonSerializer.Deserialize<InterviewHistory>(message);

                   
                    // BackgroundService is a Singleton service
                    // IHeroesRepository is declared a Scoped service
                    // by definition a Scoped service can't be consumed inside a Singleton
                    // to solve this, we create a custom scope inside the Singleton and 
                    // perform the insertion.
                    using (var scope = _sp.CreateScope())
                    {
                        var db = scope.ServiceProvider.GetRequiredService<InterviewHistoryRepository>();
                        db.Insert(request);
                        
                    }
                });
            };

            _channel.BasicConsume(queue: "interview", autoAck: true, consumer: consumer);

            return Task.CompletedTask;
        }
    }
}
