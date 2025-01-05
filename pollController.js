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
    let options = [...poll.options]
    
    let result = [];
    options.forEach(option => {
      let percentage = (option.vote * 100) / poll.totalVotes;
      result.push({ ...option._doc, percentage: percentage ? percentage : 0 });
    });

    res.render('viewPoll', { poll, result });


  }
  catch (error) {
    console.log(error);
  }
}





exports.viewPollPostController = async (req, res, next) => {
  const id = req.params.id;
  const optionId = req.body.option;

  try {
    const poll = await Poll.findById(id);
    if (!poll) {
      return res.status(404).send('Poll not found.');
    }

    const options = [...poll.options];



    const index = options.findIndex(opt => opt.id === optionId);

    if (index === -1) {
      return res.status(400).send('Invalid option.');
    }

    // Increment vote count
    options[index].vote += 1;
    const totalVotes = poll.totalVotes + 1;


    // Save updated poll
    await Poll.findByIdAndUpdate(poll._id, {
      $set: { options, totalVotes },
    });

    res.redirect(`/polls/${id}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the poll.');
  }
};