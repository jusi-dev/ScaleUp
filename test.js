

// Get all dates from this week in the format DD-MM-YYYY
function getWeekDates() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    const monday = new Date(today.setDate(diff));
    const weekDates = [];
  
    const options = { day: 'numeric', month: 'numeric', year: 'numeric', minimumIntegerDigits: 2 };
  
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      const formattedDate = nextDay.toLocaleDateString('en-GB', options).split('/').join('-');
      weekDates.push(formattedDate);
    }
    return weekDates;
}
  

// Compare two arrays and console.log the duplicates with the index
function process() {
  const weekDates = ["21-07-2023", "22-07-2023", "23-07-2023", "24-07-2023", "25-07-2023", "26-07-2023", "27-07-2023"];
  const weekDates2 = getWeekDates();
  const duplicates = [];
  weekDates.forEach((date, index) => {
    if (weekDates2.includes(date)) {
      duplicates.push({ date, index });
    }
  });
  console.log(duplicates);
}

test()

function test() {
    // Create a new Date object
    const currentDate = new Date();

    // Get the day, month, and year components
    const day = String(currentDate.getDate()).padStart(2, '0'); // Add leading zero if needed
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = currentDate.getFullYear();

    // Format the date as DD-MM-YYYY
    const formattedDate = `${day}-${month}-${year}`;

    console.log(formattedDate);
}
