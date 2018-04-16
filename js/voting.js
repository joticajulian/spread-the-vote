var json = [];

var total_vesting_fund_steem = 189873027.788;
var total_vesting_shares = 387228689154.489690;
var reward_balance = 738645.615;
var recent_claims = 440867464338.448008;
var price = 1.50;

var sizeR = 20;
var sizeRfe = 20;
var sizeRandom = 500;
var resFactor = 1;

var time_scale = 1;

var pool_ratio = (total_vesting_shares/total_vesting_fund_steem) * (reward_balance/recent_claims) * price;
var me = createUser('me');

var weight = 10000;
var threshold = parseInt(10000/sizeR);
var threshold2 = parseInt((10000-threshold)/3 + threshold);

var names = ['alice','bob','carl','dany','eva','fran','grace','hilary',
  'ines','jerry','kiki','lane','mary','nancy','omar','peter','qura','river',
  'sally','tipa','vilma','wanda','ximena'];
  
for(var i=0;i<names.length;i++){
  json.push(createUser(names[i]));
}

for(var i=0;i<sizeRandom;i++){
  json.push(createUser('random'+i));
}

$(function(){
  me.steem_power = 75000;
  weight = 10000;
  $('#label-SP').text(me.steem_power);
  $('#weight-value').text((weight/100).toFixed(0)+'% ($'+worth_vote(-1).toFixed(2)+')');
  
  $("#weight").on("change", function(event, ui) {
    console.log("new weight="+this.value);
    weight = this.value * 100;
    $('#weight-value').text((weight/100).toFixed(0)+'% ($'+worth_vote(-1).toFixed(2)+')');
  });
  
  setInterval(updateFrontEnd, 333);
  console.log(me);

});

function setSP(){
  var sp = parseFloat($('#SP').val());
  if(isNaN(sp) || sp<0){
    alert("Invalid Steem Power");
    return;
  }
  me.steem_power = sp;
  $('#label-SP').text(me.steem_power);
  $('#weight-value').text((weight/100).toFixed(0)+'% ($'+worth_vote(-1).toFixed(2)+')');
  $('#json-data').text(JSON.stringify(me, null, 2));
}

function getCurrentPower(){
  var power_regenerated = Math.round((new Date() - me.last_vote_time)/(1000*60*60*24*5) *10000 *time_scale);
  return limit100(me.voting_power + power_regenerated);  
}

function updateFrontEnd(){
  var current_power = getCurrentPower()/100;
  
  $('#voting-power').text(current_power + "%").attr('aria-valuenow', parseInt(current_power)).css('width',parseInt(current_power)+'%');
  
  time_scale = $('#time-scale').val();
  $('#time-scale-value').text(time_scale+'x');
  
  for(var i=0;i<sizeRfe;i++){
    var power = me.resistance_power[i].power/100;
    var name = me.resistance_power[i].name;
    var power_bar = parseInt(10*Math.sqrt(power));
    if(name == '') $('#labelres'+i).text('null');
    else $('#labelres'+i).text('@'+name);
    $('#voteval'+i).text('$'+worth_vote(i).toFixed(2));
    
    $('#resistance'+i).text(power + "%").attr('aria-valuenow', power_bar).css('width',power_bar+'%');
    if(power*100 >= threshold2){
      $('#resistance'+i).attr('class','progress-bar progress-bar-danger');
    }else if(power*100 >= threshold){
      $('#resistance'+i).attr('class','progress-bar progress-bar-warning');
    }else{
      $('#resistance'+i).attr('class','progress-bar progress-bar-success');
    }    
  }
}

function createUser(name){
  var res = [];
  for(var i=0;i<sizeR;i++){
    var r = {
      name:"",
      power:0,      
    }
    res.push(r);
  }
  
  return {
    name:name,
    last_vote_time:new Date(),
    last_root_post:new Date(),
    last_post:"",
    sbd_balance:0,
    steem_power:0,
    voting_power:10000,
    resistance_power:res,
    min_resistance_power:0
  };
}

function worth_vote(res_id){ 
  var used_power = Math.round(getCurrentPower()/50* (Math.abs(weight)/10000));
 
  var vote_sbd = me.steem_power * (used_power/10000) * pool_ratio;
  if(res_id == -1) return vote_sbd;
  
  var res = me.resistance_power[res_id];
  if(res.power > threshold) vote_sbd *= (10000 - res.power)/(10000 - threshold);
  return vote_sbd;
}

function vote(n){
  var current_power = getCurrentPower();
  var used_power = Math.round(current_power/50* (Math.abs(weight)/10000));
  
  if(n<0){//random
    n = Math.floor(-n*Math.random());
  }
  
  var res_id = me.resistance_power.findIndex(function(r){return r.name == json[n].name;});
  
  json[n].sbd_balance += worth_vote(res_id);
    
  me.last_vote_time = new Date();
  current_power -= used_power;
  current_power = limit100(current_power);
  me.voting_power = current_power;
  
  var power = limit100(used_power * resFactor);
  
  adjustRes(json[n].name,power);
  console.log(me);
  
  if(n<=11) $('#wallet'+n).text('$'+json[n].sbd_balance.toFixed(2));
  $('#json-data').text(JSON.stringify(me, null, 2));  
}

function adjustRes(name,power){
  var res_id = me.resistance_power.findIndex(function (r){return r.name == name});
  var min_id = me.resistance_power.findIndex(function (r){return r.power == me.min_resistance_power;});
  var p_id = -1;
  
  if(res_id < 0){
    if(power > me.min_resistance_power){
      me.resistance_power[min_id] = {
        name:name,
        power:limit100(power)
      };
      p_id = min_id;
    }  
  }else{
    me.resistance_power[res_id].power = limit100(me.resistance_power[res_id].power + power);
    p_id = res_id;
  }
  
  if(p_id >= 0) np = me.resistance_power[p_id].power;
  else{
    np = 10000;
    for(var i=0;i<sizeR;i++) np -= me.resistance_power[i].power;
  }
  
  for(var i=0;i<sizeR;i++){
    if(i == p_id || np>=10000) continue;
    me.resistance_power[i].power = limit100(me.resistance_power[i].power *(1 - power/(10000-np)));
  }
  me.min_resistance_power = getMinRes();
  
  me.resistance_power.sort(function(a,b){return b.power-a.power;});  
}

function getMinRes(){
  var min = 10000;
  for(var i=0;i<sizeR;i++){
    if(me.resistance_power[i].power < min) min = me.resistance_power[i].power;
  }
  return min;
}

function limit100(n){
  n = Math.round(n);
  return n>10000?10000:n<0?0:n;
}

function limit100100(n){
  n = Math.round(n);
  return n>10000?10000:n<-10000?-10000:n;
}