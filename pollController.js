const Poll = require('./poll')

exports.createPollGetController = (req, res, next) => {
    res.render('create');
}
exports.createPollPostController = async (req, res, next) => {
  let { title, description, options } = req.body;
  options = options.map(opt => {
    return {
      name: opt,
      vote: 0,
    }
  })
  let poll = new Poll({
    title,
    description,
    options,
  })
  try {
     await poll.save();
    res.redirect('/polls')
  }
  catch (error) {
    console.log(error);
    
  }

}


exports.getAllPolls = async function (req, res, next) {
  try {
    let polls = await Poll.find()
    res.render('polls',{polls})
  }
  catch (error) {
    console.log(error);
  }
}

exports.viewPollGetController = async (req, res, next)=> {
  let id = req.params.id;

  
  try {
    let poll = await Poll.findById(id)
    res.render('viewPoll',{poll})
  }
  catch (error) {
    console.log(error);
  }
}

exports.viewPollPostController = async (req, res,next) => {
  let id = req.params.id;
  let optionId = req.body.option
    console.log();
    
  try {
    let poll = await Poll.findById(id)
    let options = [...poll.options]

    let index = options.findIndex(opt => opt.id === optionId);
    options[index] = options[index].vote + 1;

    let totalVotes = poll.totalVotes + 1;

    // await poll.updateOne(
    //   { _id: poll._id },
    //   { $set: { options, totalVotes } }
    // );
    
    await poll.fineByIdAndUpdate( 
      id,
      { $set: { options, totalVotes } },
      { new: true }
    )

    console.log(id,poll)

    res.redirect(`/polls/${id}`)
  } catch (error) {
    console.log(error);
  }
}