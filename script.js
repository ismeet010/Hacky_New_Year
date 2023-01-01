var tog = true;
    function open_curtain()
{
 $("#curtain1").animate({width:20},1000);
 $("#curtain2").animate({width:20},1000);
 $("#bow").animate({top:620},1000);
 tog=false;
}
function close_curtain()
{
 $("#curtain1").animate({width:768},1000);
 $("#curtain2").animate({width:768},1000);
$("#bow").animate({top:250},1000);
tog=true;
}

function toggle(){
    tog ? open_curtain() : close_curtain();
}



