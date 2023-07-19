const AWS=require('aws-sdk')
const process=require('process')
const uploadToS3=(data,fileName)=>
{
    try{
        const BUCKET_NAME=process.env.BUCKET_NAME;
        const IAM_USER_KEY=process.env.IAM_USER_KEY;
        const IAM_USER_SECRET=process.env.IAM_USER_SECRET;
    
        //create object of aws
        let s3bucket=new AWS.S3(
        {
           accessKeyId:IAM_USER_KEY,
           secretAccessKey:IAM_USER_SECRET
        })
    
           var params=
           {
            Bucket:BUCKET_NAME,
            Key:fileName,
            Body:data,
            ACL:'public-read'
           }
           return new Promise((res,rej)=>
           {
            s3bucket.upload(params,(err,s3response)=>
            {
             if(err)
             {
                 console.log('Something went wrong',err)
                 rej(err)
             }
             else{
                 console.log('success',s3response)
                 res(s3response.Location)
              }
            })
           })
    }
    catch(err)
    {
        res.status(500).JSON({responce:"Something Wrong At Server Side"})
    }
        
}


module.exports=
{
   uploadToS3
}