const express=require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app=express();
const cors=require('cors');
const {MongoClient}=require('mongodb');
let db='';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
async function mongoConnect() {
    let client = new MongoClient('mongodb+srv://meandmylaptopinhorizon:hello123@cluster0.nrpfqzd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    await client.connect();
    db = client.db('test');
 };
const Dress = mongoose.model('Dress', new mongoose.Schema({
  type: String,
  price: Number,
  image: String
}), 'fashion');


const cartSchema = new mongoose.Schema({
  type: String,
  price: Number,
  image: String
});

const cart = mongoose.model('cart', cartSchema);
 const mobileSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String 
  });
  const Mobile = mongoose.model('Mobile', mobileSchema);
app.use(cors());
app.use(express.json());


app.post('/madmin', upload.single('image'), async (req, res) => {
    try {
        const { name, price } = req.body;
        const image = req.file.buffer; 

        const mobileData = {
            name: name,
            price: parseFloat(price),
            image: image, 
        };

        await db.collection('mobiles').insertOne(mobileData);

        res.status(201).send('Mobile data uploaded successfully');
    } catch (error) {
        console.error('Error uploading mobile data:', error);
        res.status(500).send('Failed to upload mobile data');
    }
});

const cartItemSchema = new mongoose.Schema({
  type: String,
  price: Number,
  image: String
});

const CartItem = mongoose.model('CartItem', cartItemSchema);


app.get('/cart', async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Server Error');
  }
});


app.delete('/cart/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    await CartItem.findByIdAndDelete(id);
    res.status(200).send('Item removed');
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).send('Server Error');
  }
});
app.post('/signup',async function(req,res){
    let output=await db.collection('signup').insertOne(req.body)
    console.log(req.body);
   
});
app.post('/login',async function(req,res){
    let output=await db.collection('login').insertOne(req.body)
    console.log(req.body);
   
});
app.get('/display',async function(req,res){
    let output=await db.collection('signup').find({}).toArray();
    res.json(output)
});
app.post('/grocery',async function(req,res){
    let output=await db.collection('cart').insertOne(req.body)
    console.log(req.body);
});
app.get('/dgrocery',async function(req,res){
    let output=await db.collection('cart').find({}).toArray();
    res.json(output)
});

app.get('/mdisplay', async (req, res) => {
    try {
      let mobiles = await db.collection('mobiles').find({}).toArray();
      res.json(mobiles); 
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ message: error.message });
    }
  });
app.post('/cart', async (req, res) => {
  const { name, price, image } = req.body;

  try {
      const newItem = new CartItem({ name, price, image });
      await CartItem.save();
      res.status(201).json(newItem);
  } catch (error) {
      res.status(500).send('Server Error');
  }
});
app.post('/fadmin', upload.single('image'), async (req, res) => {
  const { type, price } = req.body;
  const image = req.file ? req.file.buffer.toString('base64') : ''; 

  try {
    const newItem = new Dress({ type, price, image });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding dress:', error);
    res.status(500).send('Server Error');
  }
});
app.listen(5002,function(){
    console.log('running at port 5002');
    mongoConnect();
    
});