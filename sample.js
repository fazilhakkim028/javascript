//challenge 1

(function firstFunction () {
    const b = 4; const c = 6;
  
    (function secondFunction () {
      const b = 9;
  
      (function thirdFunction () {
        const a = 7; const c = 9;  
        (function fourthFunction () {
          const a = 2; const c = 7;
          console.log(`a: ${a}`);
        })()
      })()
      console.log(` b: ${b}, c: ${c}`);
    })()
  })()


  //challenge2

  let bird = 'Pidgeons';
    ( function () {
        if ( typeof bird === 'undefined' ){
            bird = 'Rubber Duck';
            console.log('Ernie loves his ' + bird );
        } else {
            console.log('Bert loves his ' + bird );
        }
    }() );

    console.log("included 1");
    console.log("included 2");
    console.log("included 3");
    console.log("included 4");
    console.log("included 5");
    console.log("included 6");
    console.log("included 7");
    console.log("included 8");
    console.log("included 9");
    console.log("included 10");