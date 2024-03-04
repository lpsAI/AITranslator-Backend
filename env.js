import dotenv from 'dotenv'

try {
    if (process.env.NODE_ENV === 'development'){
        dotenv.config({ path: '.env.development' })
    } else if (process.env.NODE_ENV === 'production') {
        dotenv.config({ path: '.env.production' })
    } 
    // else {
    //     dotenv.config({ path: '.env' })
    // }
} catch (error) {
    console.error('Error loading .env file:', error);
}