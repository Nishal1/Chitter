const formatDate = (x, reqDate) => {
    const year = x.getFullYear();
    const month = x.getMonth();
    const dt = x.getDate();
    if (dt < 10) {
      dt = '0' + dt;
    }
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let date = `${monthNames[month]} ${dt}, ${year}`;
    if(reqDate === false){
        date = `${monthNames[month]} ${year}`;
    }
    return date;
  }
  
module.exports = formatDate;