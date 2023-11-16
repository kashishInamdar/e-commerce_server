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

    if(!name){
        return res.json({
            success : false,
            message : "Name is required"
        }) 
    }
    if(!description){
        return res.json({
            success : false,
            message : "discription is required"
        }) 
    }
    if(!price){
        return res.json({
            success : false,
            message : "Price is required"
        }) 
    }
    if(!productImage){
        return res.json({
            success : false,
            message : "ProductImage is required"
        }) 
    }
    if(!brand){
        return res.json({
            success : false,
            message : "Brand is required"
        }) 
    }

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

//  ======== Delete =========

app.delete("/product/:_id", async (req , res)=>{
    const {_id} = req.params ;

    await Product.deleteOne({_id : _id});

    res.json({
        success : true,
        data : {},
        message : `successfully delete with id : ${_id}`,
    })

});

app.put("/product/:_id" , async (req , res)=>{
    const { _id } = req.params ;
    const {name ,description , price, productImage , brand  } = req.body;

    if(!name){
        return res.json({
            success : false,
            message : "Name is required"
        }) 
    }
    if(!description){
        return res.json({
            success : false,
            message : "discription is required"
        }) 
    }
    if(!price){
        return res.json({
            success : false,
            message : "Price is required"
        }) 
    }
    if(!productImage){
        return res.json({
            success : false,
            message : "ProductImage is required"
        }) 
    }
    if(!brand){
        return res.json({
            success : false,
            message : "Brand is required"
        }) 
    }


    await Product.updateOne(
        {_id , _id},
        {$set : {
            name : name ,
            description : description,
            price : price,
            productImage : productImage,
            brand : brand,
        }}
    )

    const updatedProduct = await Product.findOne({_id : _id})

    res.json({
        success : true ,
        date : updatedProduct ,
        massage : `Successfully update student with id ${_id}`
    })
});

app.patch("/product/:_id" , async (req , res)=>{
    const {_id} = req.params;

    const {name , description , price, productImage , brand} = req.body;

    const product = await Product.findById(_id);

    if(name){
        product.name = name;
    }
    if(price){
        product.price = price;
    }
    if(description){
        product.description = description;
    }
    if(productImage){
        product.productImage = productImage;
    }
    if(brand){
        product.brand = brand;
    }

    const updatedProduct = await product.save();

    res.json({
        success : true ,
        data : updatedProduct,
        message : "Successfully updated",
    })
});


app.listen(PORT , ()=>{
    console.log(`Server is running on port ${PORT}`)
})



