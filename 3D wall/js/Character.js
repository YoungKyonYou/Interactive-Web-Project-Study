function Character(info){
  //this로 했다는 것은 이 character 생성자를 통해서 만들어낼 instance 객체의 속성으로 쓰겠다는 것이다.
  this.mainElem=document.createElement('div');
  this.mainElem.classList.add('character');
  this.mainElem.innerHTML=''
  +'<div class="character-face-con character-head">'
    +'<div class="character-face character-head-face face-front"></div>'
    +'<div class="character-face character-head-face face-back"></div>'
  +'</div>'
  +'<div class="character-face-con character-torso">'
    +'<div class="character-face character-torso-face face-front"></div>'
    +'<div class="character-face character-torso-face face-back"></div>'
  +'</div>'
  +'<div class="character-face-con character-arm character-arm-right">'
    +'<div class="character-face character-head-face face-front"></div>'
    +'<div class="character-face character-head-face face-back"></div>'
  +'</div>'
  +'<div class="character-face-con character-arm character-arm-left">'
    +'<div class="character-face character-head-face face-front"></div>'
    +'<div class="character-face character-head-face face-back"></div>'
  +'</div>'
  +'<div class="character-face-con character-leg character-leg-right">'
    +'<div class="character-face character-head-face face-front"></div>'
    +'<div class="character-face character-head-face face-back"></div>'
  +'</div>'
  +'<div class="character-face-con character-leg character-leg-left">'
    +'<div class="character-face character-head-face face-front"></div>'
    +'<div class="character-face character-head-face face-back"></div>'
  +'</div>';

  document.querySelector('.stage').appendChild(this.mainElem);
  this.mainElem.style.left=info.xPos+'%';
  //스크롤 중인지 아닌지 체크하는 변수 (처음에 생성할 때는 안 하는 상태)
  //false로 지정해도 되고 안 해도 된다.
  this.scrollState=false;
  //바로 이전(마지막) 스크롤 위치
  this.lastScrollTop=0;
  // 객체의 속성으로도 등록하기
  this.xPos=info.xPos;
  this.speed=info.speed;
  this.direction;
  // 좌우 이동 중인지 아닌지 판별하는 속, 이동중이면 true
  this.runningState=false;
  this.rafId;
  this.init();
}

Character.prototype={
  constructor: Character,
  init: function(){
    const self=this;

    // 순서를 보면 첨에 clearTimeout하고 running클래스 붙 움직임이 구현이 되고
    // 일단 setTimeout 함수가 한번은 실행되고 숫자가 self.scrollState에 들어갈 것이다.(0.5초 후에)
    //그런데 스크럴 하는 동안 setTimeout이 실행될 수 없는 이유가 바로 scroll할 때마다
    //clearTimeout을 해주고 있기 때문이다. 즉 setTimeout은 0.5초가 지나야 실행이 되는데
    // 그 전에 clearTimeout이 실행되는 것이다. 스크롤 되는 동안에 계속 clear를 하게 된다
    //그래서 setTimeout은 계속 clear 때문에 실행이 안되다가 스크롤이 멈추는 순간 마지막 턴에서
    //실행되는 것이다.
    window.addEventListener('scroll',function(){
      //이 함수는 setTimeout와 세트인데 바 setTimeout가 반환하는 숫자에 해당하는 setTimeout를 취소해주는 것이다
      // 즉 scroll 이벤트가 발생하면 바로 clearTimeout이 되버린다. 그니까 무조건 self.scrollState=false가
      //안되게 하려고 노력하는 애이다.
      clearTimeout(self.scrollState);

      if(!self.scrollState){
        self.mainElem.classList.add('running');
      }

      self.scrollState=setTimeout(function(){
        self.scrollState=false;
        self.mainElem.classList.remove('running');
      },500);


      // 둘의 차이가 존, 이 두 수치를 비교해서 이전 스크롤 값이 작으면 스크롤을 내렸다고 판단할 수 있다
      // 이 두 수치를 비교해서 방향을 정할 수가 있다.
      // console.log(pageYOffset);
      // console.log(self.lastScrollTop);

      // 이전의 pageYOffset를 저장한다(마지막 스크롤 위치)
      // self.lastScrollTop=pageYOffset;

      //이전 스크롤 위치와 현재 스크롤 위치를 비교
      if(self.lastScrollTop>pageYOffset){
        //이전 스크롤 위치가 크다면: 스크롤 올림
        self.mainElem.setAttribute('data-direction', 'backward');
      }else{
        //현재 스크롤 위치가 크다면: 스크롤 내림
        self.mainElem.setAttribute('data-direction', 'forward');
      }
      self.lastScrollTop=pageYOffset;


      // eventHandler는 이벤트가 일어날 함수를 일으킨다. 그런데 여기 안에서 this가 가르치는 것이 뭘까?
      //click일땐 click할 때 이다. 우리가 원하는 this는 character instance를 가르키길 원한다.
      //근데 이건 window를 가리킨다. 어덯게 할까? 다른 방법을 쓴다. 이 this를 다른 변수에 미리 넣어둔다.
      // 그것이 바로 위에 self 변수이다.
      // self.mainElem.classList.add('running');
    });
    window.addEventListener('keydown',function(e){
      if(self.runningState) return;
      //아스키 코드 출력함
      if(e.keyCode==37){
        self.direction='left'
        self.mainElem.setAttribute('data-direction','left');
        self.mainElem.classList.add('running');
        self.run(self);
        self.runningState=true;
        // self.xPos -=self.speed;
        // self.mainElem.style.left=self.xPos+'%';
      }else if(e.keyCode==39){
        self.direction='right'
        self.mainElem.setAttribute('data-direction','right');
        self.mainElem.classList.add('running');
        self.run(self);
          self.runningState=true;
      }
    });

    window.addEventListener('keyup',function(e){
      self.mainElem.classList.remove('running');
      self.runningState=false;
      cancelAnimationFrame(self.rafId);
    });
  },
  run: function(self){
    // console.log(self.xPos);

    if(self.direction=='left'){
      self.xPos-=self.speed;
    }else if(self.direction=='right'){
      self.xPos+=self.speed;
    }
    if(self.xPos<2){
      self.xPos=2;
    }
    if(self.xPos>88){
      self.xPos=88;
    }

    self.mainElem.style.left=self.xPos+'%';

    //self의 run, 바로 위에 거 실행
    // requestAnimationFrame 때문에 this가 가르치는 애가 바뀐다.
    //
    self.rafId=requestAnimationFrame(function(){
      self.run(self);
    });
  }
};
