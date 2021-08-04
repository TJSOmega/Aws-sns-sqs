const { Consumer } = require('sqs-consumer')

const app = Consumer.create({
  queueUrl: 'https://sqs.us-west-1.amazonaws.com/071870753433/shoes',
  handleMessage: async (message) => {
    const orderItem = JSON.parse(message.Body)

    console.log(`Thank you for delivering ${orderItem._id} --- ${orderItem.quantity} ${orderItem.item}`)

     
  }
})

app.on('error', (err) => {
  console.error(err.message);
});

app.on('processing_error', (err) => {
  console.error(err.message);
});

app.start()