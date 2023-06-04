module.exports.getDate = getDate;

function getDate() {
  const today = new Date();

  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };

  return today.toLocaleDateString("en-US", options);
}

// CAN ALSO BE USED THIS WAY
module.exports.hello = function() {
  return "Hello World";
}