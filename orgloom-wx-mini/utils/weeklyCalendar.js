// 获取每周的数据
function getWeeklyCalendar(some, currDate) {
    var getWeeklyCalendar = []; //用于保存一周的数据
    for (var i = some, len = some + 7; i < len; i++) {
        var year = calcTime(i, currDate).year,
            month = calcTime(i, currDate).month,
            date = calcTime(i, currDate).date;
        var weekname = calcTime(i, currDate).weekname;
        if (month < 10) month = '0' + month;
        if (date < 10) date = '0' + date;

        getWeeklyCalendar.push({
            year: year,
            month: month,
            date: date,
            date_text:month+"/"+date,
            weekname:weekname,
            time:year+"-"+month+"-"+date+" 00:00:00"
        });
    }
    return getWeeklyCalendar;
}
/**
  * 计算过去或者是未来时间
  @param obj 返回的月份和日期  
  @param {number} num 计算过去或者是未来的某天
*/
function calcTime(num, currDate) {
    num = num || 0;
    var today = new Array("日", "一", "二", "三", "四", "五", "六"); //创建星期数组  
    var someTime = currDate.getTime()+ (24 * 60 * 60 * 1000) * num,
        someYear = new Date(someTime).getFullYear(),
        someMonth = new Date(someTime).getMonth() + 1, //未来月
        someDate = new Date(someTime).getDate(); //未来天
    var obj = {
        "year": someYear,
        "month": someMonth,
        "date": someDate,
        "weekname":today[new Date(someTime).getDay()]
    };
    return obj;
}

/*前一周和后一周方法*/
function changeWeek(clickedTimes, currDate, currDay) {
    var weeks = getWeeklyCalendar(-currDay - (7 * clickedTimes), currDate);
    return weeks;
}
// 把方法暴露出使用
module.exports = {
    getWeeklyCalendar: getWeeklyCalendar,
    changeWeek: changeWeek
};