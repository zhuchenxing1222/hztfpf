// JavaScript Document

$(function () {
    $('#chart_traf_flow').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: '交通状态日趋势分析'
        },
		credits:{
			enabled:false
			},
        xAxis: {
			startOnTick: false,
            endOnTick: false,
			allowDecimals:false,
			labels:{
				formatter:function() {
					return this.value+':00';
					}
				},
            //categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
			showLastLabel: true
        },
		
        yAxis: {
            min: 0,
            title: {
                text: null
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.percentage:.0f}%<br>',
            shared: true
        },
        plotOptions: {
            column: {
                stacking: 'percent'
            }
        },
            series: [{
            name: '拥堵',
			color:'#FF0000',
            data: []
        }, {
            name: '一般',
			color:'#FFA500',
            data: []
        }, {
            name: '通畅',
			color:'#00FF00',
            data: []
        }]
    });
});



$(function () {
    $('#chart_crowd_num').highcharts({
		chart: {
			type:"column"
			},
        title: {
            text: '拥堵指数日趋势分析',
            x: -20 //center
        },
		credits:{
			enabled:false
			},
		xAxis: {
			allowDecimals:false,
			labels:{
				formatter:function() {
					return this.value+':00';
					}
				},
			},
        yAxis: {
            title: {
                text: '拥堵指数'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
			formatter:function() {
				var h = parseInt(this.x);
				var h_str = h.toString();
				if (h<10) h_str='0'+h_str
				var m = Math.round((this.x%1)*60);
				var m_str = m.toString()
				if (m<10) m_str = '0'+m_str;
				return '时间：'+h_str+':'+m_str+'<br>拥堵指数：'+this.y;
				}
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        series: [{
            name: '拥堵指数',
            data: []
        }
		]
    });
});		


$(function () {
    $('#chart_crowd_time').highcharts({
		chart: {
			type:"spline"
			},
        title: {
            text: '拥堵时间日趋势分析',
            x: -20 //center
        },
		credits:{
			enabled: false
			},
		xAxis: {
			allowDecimals:false,
			labels:{
				formatter:function() {
					return this.value+':00';
					}
				}
			
			},
			
        yAxis: {
            title: {
                text: '拥堵时间(分钟)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
		tooltip: {
			formatter:function() {
				var h = parseInt(this.x);
				var h_str = h.toString();
				if (h<10) h_str='0'+h_str
				var m = Math.round((this.x%1)*60);
				var m_str = m.toString()
				if (m<10) m_str = '0'+m_str;
				return '时间：'+h_str+':'+m_str+'<br>拥堵时间：'+this.y+'分钟';
				}
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        series: [{
            name: '拥堵时长',
            data: []
        }
		]
    });
});

$(function () {
    $('#chart_car_speed').highcharts({
       chart: {
			type:"spline"
			},
        title: {
            text: '行程车速日趋势分析',
            x: -20 //center
        },
		credits:{
			enabled:false
			},
		xAxis: {
			allowDecimals:false,
			labels:{
				formatter:function() {
					return this.value+':00';
					}
				}
			},
        yAxis: {
            title: {
                text: '行程车速(公里/小时)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
			
        },
        tooltip: {
			formatter:function() {
				var h = parseInt(this.x);
				var h_str = h.toString();
				if (h<10) h_str='0'+h_str
				var m = Math.round((this.x%1)*60);
				var m_str = m.toString()
				if (m<10) m_str = '0'+m_str;
				return '时间：'+h_str+':'+m_str+'<br>车流量：'+this.y+'公里/小时';
				}
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            borderWidth: 0
        },
        series: [{
            name: '车速',
            data: []
        }
		]
    });
});

$(document).ready(function(e) {
	var def_date = new Date();
	def_year = def_date.getYear();
	def_month = def_date.getMonth();
	def_day = def_date.getDay();
	def_zone = 1;//默认的区域编号
	data_req(def_year,def_month,def_day,def_zone);
});

var t_itv=5
var max_val_time_l = 0
var max_val_time_r = t_itv/120;

var avg_val = -1;

function state_data_update(data) {
	$('#chart_traf_flow').highcharts().series[0].setData(data[0]);
	$('#chart_traf_flow').highcharts().series[1].setData(data[1]);
	$('#chart_traf_flow').highcharts().series[2].setData(data[2]);
	}


function ct_data_update(data) {
	var max_val = -1;
	var max_val_time=0;
	var total_val = 0;
	chart_data = data;
	for (var i=0;i < data.length;i++) {
		tv=data[i];
		t = tv[0];
		v = tv[1];
		if(v>max_val){
			max_val = v;
			max_val_time = t; 
			}
		total_val+=v;
		
		}
		
	max_val_time_l = max_val_time-t_itv/120;
	max_val_time_r = max_val_time+t_itv/120;
	
	remove_max_timeband('chart_crowd_time')
	add_max_timeband('chart_crowd_time',max_val_time_l,max_val_time_r)
	
	avg_val = total_val/data.length
	remove_avg_line('chart_crowd_time')
	add_avg_line('chart_crowd_time',avg_val);
	remove_his_avg_line('chart_crowd_time');
	add_his_avg_line('chart_crowd_time',10);
	//$('#chart_crowd_num').highcharts().series[0].setData(chart_data);
	$('#chart_crowd_time').highcharts().series[0].setData(chart_data);
	//$('#chart_car_speed').highcharts().series[0].setData(chart_data);
	}

function ci_data_update(data) {
	
	
	var max_val = -1;
	var max_val_time=0;
	var total_val = 0;
	
	chart_data = data;
	for (var i=0;i < data.length;i++) {
		tv=data[i];
		t = tv[0];
		v = tv[1];
		if(v>max_val){
			max_val = v;
			max_val_time = t; 
			}
		total_val+=v;
		}
	max_val_time_l = max_val_time-t_itv/120;
	max_val_time_r = max_val_time+t_itv/120;
	
	avg_val = total_val/data.length 
	remove_avg_line("chart_crowd_num")
	add_avg_line("chart_crowd_num",avg_val)
	remove_his_avg_line("chart_crowd_num")
	add_his_avg_line("chart_crowd_num",4.5)  
	$('#chart_crowd_num').highcharts().series[0].setData(chart_data);
	
	remove_max_timeband("chart_crowd_num")
	add_max_timeband("chart_crowd_num",max_val_time_l,max_val_time_r)
	
	
	}
function speed_data_update(data) {
	
	var max_val = -1;
	var max_val_time=0;
	var total_val = 0;
	
	chart_data = data;
	for (var i=0;i < data.length;i++) {
		tv=data[i];
		t = tv[0];
		v = tv[1];
		if(v>max_val){
			max_val = v;
			max_val_time = t; 
			}
		total_val+=v;
		}
	max_val_time_l = max_val_time-t_itv/120;
	max_val_time_r = max_val_time+t_itv/120;
	
	avg_val = total_val/data.length 
	remove_avg_line('chart_car_speed')
	add_avg_line('chart_car_speed',avg_val)
	remove_his_avg_line('chart_car_speed')
	add_his_avg_line('chart_car_speed',30)  
	$('#chart_car_speed').highcharts().series[0].setData(chart_data);
	remove_max_timeband("chart_car_speed")
	add_max_timeband("chart_car_speed",max_val_time_l,max_val_time_r)
	
	
	}

function state_data_req(year,month,day,zoneid) {
	var data = generate_state_data({year:year,month:month,day:day})
	state_data_update(data)
	}

function ct_data_req(year,month,day,zoneid) {
	var data = generate_ct_data({year:year,month:month,day:day})
	ct_data_update(data);
	}

function ci_data_req(year,month,day,zoneid) {
	var data = generate_ci_data({year:year,month:month,day:day})
	ci_data_update(data);
	}
function speed_data_req(year,month,day,zoneid) {
	var data = generate_speed_data({year:year,month:month,day:day})
	speed_data_update(data);
	}

function data_req(year,month,day,zoneid) {
	state_data_req(year,month,day,zoneid);
	ct_data_req(year,month,day,zoneid)
	ci_data_req(year,month,day,zoneid)
	speed_data_req(year,month,day,zoneid)
	}

function history_update(data) {
	$('#his_max_val').text(data[0])
	$('#his_min_val').text(data[1])
	$('#last_arv_max_val').text(data[2])
	$('#last_arv_arv_val').text(data[3])
	$('#last_arv_total_val').text(data[4])
	}
	
	
function hot_data_update(data) {
	$('#xh_max_val').text(data[0][0])
	$('#xh_avg_val').text(data[0][1])
	$('#xh_total_val').text(data[0][2])
	
	
	$('#xc_max_val').text(data[0][0])
	$('#xc_avg_val').text(data[0][1])
	$('#xc_total_val').text(data[0][2])
	
	
	$('#sh_max_val').text(data[0][0])
	$('#sh_avg_val').text(data[0][1])
	$('#sh_total_val').text(data[0][2])
	
	$('#gs_max_val').text(data[0][0])
	$('#gs_avg_val').text(data[0][1])
	$('#gs_total_val').text(data[0][2])
	
	
	
	}	
function history_req(year,month,day,zone) {
	data = generate_his_data()
	history_update(data)
	}

function hot_data_req(year,month,day,zone) {
	data = generate_hot_data()
	hot_data_update(data)
	}





function set_t_itv(itv) {
	t_itv = itv
	}


var chart_array = new Array('#chart_crowd_time','#chart_crowd_num','#chart_car_speed')

var pline_id_pref='trfctl_l'
function add_tfctl_line() {
	
	for (var i = 0;i<chart_array.length;i++) {
		var chart = $(chart_array[i]).highcharts();
		chart.xAxis[0].addPlotLine({
                color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:7,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2px
				id:pline_id_pref+String(i)+'1'
            });
	
	chart.xAxis[0].addPlotLine({
				color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:8.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				id:pline_id_pref+String(i)+'2'
				});
		
	chart.xAxis[0].addPlotLine({
                color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:17,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2px
				id:pline_id_pref+String(i)+'3'
            });
	
	chart.xAxis[0].addPlotLine({
				color:'red',            //线的颜色，定义为红色
                dashStyle:'longdashdot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:18.5,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,                //标示线的宽度，2
				id:pline_id_pref+String(i)+'4'
				});
		}
		
	}
	
function remove_tfctl_line() {
	for (var i = 0;i<chart_array.length;i++) {
		var chart = $(chart_array[i]).highcharts();
		for (var j = 0;j<4;j++) {
		var id=j+1;
		chart.xAxis[0].removePlotLine(pline_id_pref+String(i)+id);
		}
	}
	}
	
band_id_pref = 'timeband'	
function add_max_timeband(chart_cont,max_val_time_l,max_val_time_r) {
		var chart = $("#"+chart_cont).highcharts();
		chart.xAxis[0].addPlotBand({ // mark the weekend
                color: '#FF7F00',
                from: max_val_time_l,
                to: max_val_time_r,
				id: band_id_pref+chart_cont+'0'
            });
	}
	
function remove_max_timeband(chart_cont) {
		var chart = $("#"+chart_cont).highcharts();
		chart.xAxis[0].removePlotBand(band_id_pref+chart_cont+'0');
	}


/*for (var i = 0;i<chart_array.length;i++) {
		var chart = $(chart_array[i]).highcharts();
	}*/

var avg_id_pref="avg_val_line"
function add_avg_line(chart_cont,avg_val) {
		var chart = $("#"+chart_cont).highcharts();
		chart.yAxis[0].addPlotLine({ // mark the weekend
              	color:'#1E90FF',            //线的颜色，定义为红色
                dashStyle:'ShortDot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:avg_val,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				label:{
					text:"平均线",
					style: {
                        color: '#1E90FF',
                        fontWeight: 'bold'
                    }
					},
				id:avg_id_pref+chart_cont+'0'
            });
	}
	
function remove_avg_line(chart_cont) {
		var chart = $("#"+chart_cont).highcharts();
		chart.yAxis[0].removePlotLine(avg_id_pref+chart_cont+'0');
	}


var his_avg_id_pref="his_avg_val_line"
function add_his_avg_line(chart_cont,h_avg_val) {
		var chart = $("#"+chart_cont).highcharts();
		chart.yAxis[0].addPlotLine({ // mark the weekend
              	color:'#FF0000',            //线的颜色，定义为红色
                dashStyle:'ShortDot',//标示线的样式，默认是solid（实线），这里定义为长虚线
                value:h_avg_val,                //定义在那个值上显示标示线，这里是在x轴上刻度为3的值处垂直化一条线
                width:2,               //标示线的宽度，2
				label:{
					align:'right',
					text:"历史平均线",
					style: {
                        color: '#FF0000',
                        fontWeight: 'bold'
                    }
					},
				id:his_avg_id_pref+chart_cont+'0'
            });
	
	}
	
function remove_his_avg_line(chart_cont) {
		var chart = $("#"+chart_cont).highcharts();
		chart.yAxis[0].removePlotLine(his_avg_id_pref+chart_cont+'0');
	}

	
//test funciton

function generate_state_data(date) {
	var data = new Array()
	for (var i=0;i<3;i++) {
		stadata = new Array()
		for (var j = 1;j<=24;j++) {
			stadata.push(parseInt(Math.random()*100))
			}
		data.push(stadata)
		}
	return data;
	}

function generate_ct_data(date) {
	dc = (24*60)/t_itv
	data = new Array()
	for (var i = 0;i<dc;i++) {
		t = i*t_itv/60;
		v = Math.random()*20;
		data.push([t,Math.round(v*100)/100]);
		}
	return data;
	}

function generate_ci_data(date) {
	dc = (24*60)/t_itv
	data = new Array()
	for (var i = 0;i<dc;i++) {
		t = i*t_itv/60;
		v = Math.random()*10;
		
		data.push([t,Math.round(v*100)/100]);
		}
	return data;
	
	}

function generate_speed_data(date) {
	dc = (24*60)/t_itv
	data = new Array()
	for (var i = 0;i<dc;i++) {
		t = i*t_itv/60;
		v = Math.random()*60;
		
		data.push([t,Math.round(v*100)/100]);
		}
	return data;
	
	}
	
	
function generate_his_data() {
	data = new Array()
	data.push(100)
	data.push(200)
	data.push(300)
	data.push(400)
	data.push(1000)
	return data
	}
function generate_hot_data() {
	data = new Array()
	for (var i = 0;i<4;i++) {
		h_data = new Array()
		h_data.push(100)
		h_data.push(200)
		h_data.push(300)
		data.push(h_data)
		}
	return data
	}
function change_sub(){
	data=generate_data()
	$('#chart_traf_flow').highcharts().series[0].setData(data);
	$('#chart_crowd_time').highcharts().series[0].setData(data);
}