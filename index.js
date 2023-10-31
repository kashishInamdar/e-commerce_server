import mongoose , {model , Schema} from "mongoose";
import  express  from "express";
import dotenv from "dotenv"
dotenv.config()

const app = express() ;
app.use(express.json());

const PORT = 5000;

const connectMongoDB = async ()=>{
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    if(conn){
        console.log("MongoDB Connect Successfully")
    }
};
connectMongoDB();

const productSchema = new Schema({
    name : String ,
    description : String , 
    price : Number ,
    productImage : String ,
    brand : String,  
})

const Product = model("Product" , productSchema);

app.get("/health", (req , res)=>{
    res.json({status : "All Good"})
} )

app.get("/products" , async (req , res)=>{
    const products =  await Product.find()

    res.json({
        success : true ,
        data : products,
        massage : "successfull fetched all students ",
    })
});

app.post("/product" , async (req ,res)=>{
    const {name ,description , price, productImage , brand  } = req.body;

    const newProduct = new Product({
        name : name ,
        description : description , 
        price : price, 
        productImage : productImage , 
        brand : brand ,
    })

    const savedProduct = await newProduct.save();

    res.json({
        success : true ,
        data : savedProduct,
        massage : "Successfully added a new Product"
    })
})

app.get("/product" , async (req , res )=>{
    const  {name} = req.query;
    const product = await Product.findOne({name : name});

    res.json({
        success : true , 
        data : product,
        message : "Succcessfully find product",
    })
})


app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})



