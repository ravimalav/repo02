const getExpences=(req)=>
{
  return req.user.getExpences();
}

module.exports=
{
  getExpences
}