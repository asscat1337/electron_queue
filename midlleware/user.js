module.exports = function(req,res,next){
  res.locals.user= req.session.username;
  res.locals.terminal = req.session.terminal;
  next()
}