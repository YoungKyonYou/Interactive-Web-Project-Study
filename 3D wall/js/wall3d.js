(function(){

  const stageElem=document.querySelector('.stage');
  const houseElem=document.querySelector('.house');
  const barElem=document.querySelector('.progress-bar');
  const selectCharacterElem=document.querySelector('.select-character');
  // let maxScrollValue=document.body.offsetHeight-window.innerHeight;
  const mousePos={x:0, y:0};
  // console.log(maxScrollValue);
  function resizeHandler(){
    maxScrollValue=document.body.offsetHeight-window.innerHeight;
  }
  window.addEventListener('scroll',function(){
    const scrollPer=pageYOffset/maxScrollValue;
    // console.log(pageYOffset/maxScrollValue);
    const zMove=scrollPer*980-490;
    houseElem.style.transform='translateZ('+zMove+'vw)';

    // progress bar
    barElem.style.width=scrollPer*100+'%';
  });
  window.addEventListener('mousemove',function(e){
    // 마우스가 움직일 때마다 위치 출력
    // console.log(e.clientX, e.clientY);

// 마우스가 가운데에 있을 때 0으로 만들어줘야 함
    //현재 마우스의 x위치 나누기 전체 폭 비율을 나타낸다 즉 0.xxx가 될 것이다.

    mousePos.x=-1+(e.clientX/window.innerWidth)*2;
    mousePos.y=1-(e.clientY/window.innerHeight)*2;
    stageElem.style.transform='rotateX('+(mousePos.y*5)+ 'deg) rotateY('+ (mousePos.x*5)+'deg)';
  });
  // 창 크기가 다를 때 resize를 진행함
  window.addEventListener('resize',resizeHandler);

  stageElem.addEventListener('click',function(e){
    // console.log(e.clientX/window.innerWidth*100);
    new Character({
      xPos: e.clientX/window.innerWidth*100,
      speed: Math.random()*0.5+0.2
    });
  });

  selectCharacterElem.addEventListener('click', function(e){
     console.log(e.target.getAttribute('data-char'));
    const value=e.target.getAttribute('data-char');
    document.body.setAttribute('data-char',value);
  });

  resizeHandler();

})();
