import React from "react";

const HolidaysList = () => {
  
  const holidaysData = [
    { id: 1, name: "Independence Day", date: "2024-08-15" },
    { id: 2, name: "Janmastami", date: "2024-08-26" },
    { id: 3, name: "Ganesh Chaturthi", date: "2024-09-07" },
    { id: 4, name: "Dussehra", date: "2024-10-12" },
    { id: 5, name: "Diwali", date: "2024-11-02" },
    { id: 6, name: "Christmas", date: "2024-12-25" }
  ];

  
  const holidays = holidaysData.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    const month = holidayDate.getMonth();
    return month >= 7 && month <= 11; 
  });

  return (
    <div className="box-container"> 
      <div className="holidays-container"> 
        <h2>Holidays</h2>
        <ul>
          {holidays.map((holiday) => (
            <li key={holiday.id}>{holiday.name} - {holiday.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HolidaysList;
