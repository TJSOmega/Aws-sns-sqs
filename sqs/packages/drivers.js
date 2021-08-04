'use strict'
const { Producer } = require('sqs-producer')
const { Consumer } = require('sqs-consumer')

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-1.amazonaws.com/071870753433/Packages.fifo',
  handleMessage: async (message) => {
    await setTimeout(async () => {
      const parseBody = JSON.parse(message.Body);
      const orderItem = JSON.parse(parseBody.Message)

      console.log(`Received Order ${orderItem._id}`)

      const producer = Producer.create({
        queueUrl: orderItem.queue,
        region: 'us-west-1'
      })
      let sendMessage = {
        id: orderItem._id,
        body: JSON.stringify(orderItem, undefined, 2)
      }



      console.log(`DELIVERING ${orderItem._id}`)
      await producer.send(sendMessage, function (err, msg) {
        if (err) { console.error(err); }
        else { console.log('SENT', msg) }

      })


      console.log(`DELIVERED TO ${orderItem.customer.name}`)

    }, 8000)
  }
})

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start();

