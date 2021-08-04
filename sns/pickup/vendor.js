'use strict';

const AWS = require('aws-sdk')
const faker = require('faker');


AWS.config.update({ region: 'us-west-1' })

const sns = new AWS.SNS()

const topic = 'arn:aws:sns:us-west-1:071870753433:Pickup.fifo'


function storePicker() {
  let namesArray = ['TJ\'s Donuts Express', 'Premium Shoes Store']
  let productsArray = ['donuts', 'shoes']
  let queueArray = ['https://sqs.us-west-1.amazonaws.com/071870753433/donuts', 'https://sqs.us-west-1.amazonaws.com/071870753433/shoes']
  let num = Math.floor(Math.random() * 2);

  let store = {
    name: namesArray[num],
    product: productsArray[num],
    vendorQueue: queueArray[num]
  }

  return store
}

setInterval(function () {
  let store = storePicker()
  let orderItem = {
    _id: faker.datatype.uuid(),
    store: store.name,
    queue: store.vendorQueue,
    quantity: Math.floor(Math.random() * 10) + 1,
    item: '',
    customer: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      address: `${faker.address.streetAddress()} ${faker.address.streetName()}`,
    }
  }

  orderItem.item = `${(orderItem.quantity > 1) ? 'boxes' : 'box'} of ${store.product.toLowerCase()}`

  console.log(`Order up! ${orderItem._id}`)

  let stringItem = JSON.stringify(orderItem, undefined, 2)

  const payload = {
    Message: stringItem,
    TopicArn: topic,
    MessageGroupId: '1'
  }

  sns.publish(payload).promise()
    .then(data => {
      console.log(data)
    })
    .catch(console.error)

}, Math.floor(Math.random() * 10000))




