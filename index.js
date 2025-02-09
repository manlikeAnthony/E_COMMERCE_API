require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();
//security
const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')
//packages
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const PORT = process.env.PORT || 3000;
const connectDB = require('./database/connect');

// router

const authRouter = require('./routes/authRoute')
const userRouter = require('./routes/userRoutes')
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes')
const orderRouter = require('./routes/orderRoute')
//middleware
const errorHandlerMiddleware = require('./middleware/error-handler');
const notFoundMiddleware = require('./middleware/notFound')

app.set('trust proxy');
app.use(rateLimiter({
    windowsMs:15 *60*1000,
    max : 60
}))

app.use(helmet())
app.use(cors())
app.use(xss())
app.use(mongoSanitize())


// app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.urlencoded({extended:true}));

app.use(express.static('./public'))
app.use(fileUpload())


app.use('/api/v1/auth' , authRouter);
app.use('/api/v1/users' , userRouter);
app.use('/api/v1/products' , productRouter);
app.use('/api/v1/reviews' , reviewRouter);
app.use('/api/v1/orders' , orderRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware);
const start = async ()=>{   
    try {
        await connectDB(process.env.MONGO_URL);
        console.log('GOD FIRST');
        app.listen(PORT , console.log(`the app is listening on port ${PORT}...`))
    } catch (error) {
        console.log(error)
    }
}

start()