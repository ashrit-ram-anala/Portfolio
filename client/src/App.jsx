import './App.css'
import React, { useState, useEffect} from 'react';
import Typed from 'typed.js';

function App() {
  const el = React.useRef(null);
  const cursorRef = React.useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const handleToggle = () => {
    setIsVisible(!isVisible);
  };

  React.useEffect(() => {
    const typed = new Typed(el.current, {
      strings: ["I'm Interested In... ", "Full Stack", "Database Design", "Machine Learning", "Security With JWT", "Data Science", "And...","Tech, In General", "Scroll For More!"],
    loop: true,
    typeSpeed: 40,
    backSpeed: 25,
    backDelay: 650,
    });

    return () => {
      typed.destroy();
    };
  }, []);

  useEffect(() => {
    const cursor = cursorRef.current;

    const handleMouseMove = (e) => {
      cursor.style.top = `${e.clientY}px`;
      cursor.style.left = `${e.clientX}px`;
      
    };
    const handleMouseEnter = () => {
      cursor.classList.add('cursor-hover');
    };

    const handleMouseLeave = () => {
      cursor.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.querySelectorAll('a, .link, button, img').forEach((el) => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.querySelectorAll('a, .link, button, img').forEach((el) => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
   
    <>
  <div ref={cursorRef} className="cursor"></div>
  <header id="home">
    <div className="bg-animation">
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div id="stars4" />
    </div>
    <div className="nav">
      <div className="nav-links" style={{ padding: 20 }}>
        <a href="#home" style={{ textDecoration: "none" }}>
          <span className="nav-item">Home</span>
        </a>
        <a href="#about" style={{ textDecoration: "none" }}>
          <span className="nav-item">About</span>
        </a>
        <a href="#education" style={{ textDecoration: "none" }}>
          <span className="nav-item">Education</span>
        </a>
        <a href="#work" style={{ textDecoration: "none" }}>
          <span className="nav-item">Experience</span>
        </a>
        <a href="#op" style={{ textDecoration: "none" }}>
          <span className="nav-item">Projects</span>
        </a>
        <a href="#honors" style={{ textDecoration: "none" }}>
          <span className="nav-item">Honors</span>
        </a>
      </div>
    </div>
    <div>
      <p className="white heading-name">Hi! I'm Ashrit</p>
      <div className="social-header">
        <ul>
          <li>
            <a
              href="https://github.com/ashrit-ram-anala?ocid=AIDcmmcwpj1e5v_SEM__k_CjwKCAjw8diwBhAbEiwA7i_sJepuEpAmhLac-rU_q6UndVsjmboAMo-3-iCxCtsVB5DyclFH3pvQmRoCUKQQAvD_BwE_k_"
              target="_blank"
            >
              <svg
                fill="#a5a5a5"
                className="github-header"
                width="30px"
                height="30px"
                viewBox="0 0 16 16"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M7.976 0A7.977 7.977 0 000 7.976c0 3.522 2.3 6.507 5.431 7.584.392.049.538-.196.538-.392v-1.37c-2.201.49-2.69-1.076-2.69-1.076-.343-.93-.881-1.175-.881-1.175-.734-.489.048-.489.048-.489.783.049 1.224.832 1.224.832.734 1.223 1.859.88 2.3.685.048-.538.293-.88.489-1.076-1.762-.196-3.621-.881-3.621-3.964 0-.88.293-1.566.832-2.153-.05-.147-.343-.978.098-2.055 0 0 .685-.196 2.201.832.636-.196 1.322-.245 2.007-.245s1.37.098 2.006.245c1.517-1.027 2.202-.832 2.202-.832.44 1.077.146 1.908.097 2.104a3.16 3.16 0 01.832 2.153c0 3.083-1.86 3.719-3.62 3.915.293.244.538.733.538 1.467v2.202c0 .196.146.44.538.392A7.984 7.984 0 0016 7.976C15.951 3.572 12.38 0 7.976 0z"
                />
              </svg>
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/ashritramanala/"
              target="_blank"
            >
              <svg
                fill="#a5a5a5"
                className="linkedin-header"
                width="30px"
                height="30px"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 291.319 291.319"
                style={{ enableBackground: "new 0 0 291.319 291.319" }}
                xmlSpace="preserve"
              >
                <g>
                  <path
                    d="M145.659,0c80.45,0,145.66,65.219,145.66,145.66s-65.21,145.659-145.66,145.659S0,226.1,0,145.66
                     S65.21,0,145.659,0z"
                  />
                  <path
                    style={{ fill: "#303030" }}
                    d="M82.079,200.136h27.275v-90.91H82.079V200.136z M188.338,106.077
                     c-13.237,0-25.081,4.834-33.483,15.504v-12.654H127.48v91.21h27.375v-49.324c0-10.424,9.55-20.593,21.512-20.593
                     s14.912,10.169,14.912,20.338v49.57h27.275v-51.6C218.553,112.686,201.584,106.077,188.338,106.077z M95.589,100.141
                     c7.538,0,13.656-6.118,13.656-13.656S103.127,72.83,95.589,72.83s-13.656,6.118-13.656,13.656S88.051,100.141,95.589,100.141z"
                  />
                </g>
              </svg>
            </a>
          </li>
          <li>
            <a href="../files/AshritRamAnala_Resume.pdf" target="_blank">
              <div className="resume">CV</div>
            </a>
          </li>
          <li>
            <a href="https://app.cal.com/ashrit-anala" target="_blank">


 <svg fill="#303030" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="-146.88 -146.88 905.76 905.76" xml:space="preserve" stroke="#303030"><g id="SVGRepo_bgCarrier" stroke-width="0"><rect className="phone" x="-146.88" y="-146.88" width="905.76" height="905.76" rx="452.88" fill="#a5a5a5" strokewidth="0"></rect></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M612,463.781c0-70.342-49.018-129.199-114.75-144.379c-10.763-2.482-21.951-3.84-33.469-3.84 c-3.218,0-6.397,0.139-9.562,0.34c-71.829,4.58-129.725,60.291-137.69,131.145c-0.617,5.494-0.966,11.073-0.966,16.734 c0,10.662,1.152,21.052,3.289,31.078C333.139,561.792,392.584,612,463.781,612C545.641,612,612,545.641,612,463.781z M463.781,561.797c-54.133,0-98.016-43.883-98.016-98.016s43.883-98.016,98.016-98.016s98.016,43.883,98.016,98.016 S517.914,561.797,463.781,561.797z"></path> <polygon points="482.906,396.844 449.438,396.844 449.438,449.438 396.844,449.438 396.844,482.906 482.906,482.906 482.906,449.438 482.906,449.438 "></polygon> <path d="M109.969,0c-9.228,0-16.734,7.507-16.734,16.734v38.25v40.641c0,9.228,7.506,16.734,16.734,16.734h14.344 c9.228,0,16.734-7.507,16.734-16.734V54.984v-38.25C141.047,7.507,133.541,0,124.312,0H109.969z"></path> <path d="M372.938,0c-9.228,0-16.734,7.507-16.734,16.734v38.25v40.641c0,9.228,7.507,16.734,16.734,16.734h14.344 c9.228,0,16.734-7.507,16.734-16.734V54.984v-38.25C404.016,7.507,396.509,0,387.281,0H372.938z"></path> <path d="M38.25,494.859h236.672c-2.333-11.6-3.572-23.586-3.572-35.859c0-4.021,0.177-7.999,0.435-11.953H71.719 c-15.845,0-28.688-12.843-28.688-28.688v-229.5h411.188v88.707c3.165-0.163,6.354-0.253,9.562-0.253 c11.437,0,22.61,1.109,33.469,3.141V93.234c0-21.124-17.126-38.25-38.25-38.25h-31.078v40.641c0,22.41-18.23,40.641-40.641,40.641 h-14.344c-22.41,0-40.641-18.231-40.641-40.641V54.984H164.953v40.641c0,22.41-18.231,40.641-40.641,40.641h-14.344 c-22.41,0-40.641-18.231-40.641-40.641V54.984H38.25C17.126,54.984,0,72.111,0,93.234v363.375 C0,477.733,17.126,494.859,38.25,494.859z"></path> <circle cx="134.774" cy="260.578" r="37.954"></circle> <circle cx="248.625" cy="260.578" r="37.954"></circle> <circle cx="362.477" cy="260.578" r="37.954"></circle> <circle cx="248.625" cy="375.328" r="37.953"></circle> <circle cx="134.774" cy="375.328" r="37.953"></circle> </g> </g> </g></svg>
           
            </a>
          </li>
          <li>
            <a href="mailto:ashritramanala@yahoo.com">
              <svg
                className="contact-header"
                fill="#a5a5a5"
                height="30px"
                width="30px"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 64 64"
                xmlSpace="preserve"
              >
                <style
                  type="text/css"
                  dangerouslySetInnerHTML={{
                    __html:
                      "\n                   .st0{}\n                   .st1{opacity:0.2;}\n                   .st2{fill:#231F20;}\n                   .st3{fill:#303030;}\n               "
                  }}
                />
                <g id="Layer_1">
                  <g>
                    <circle className="st0" cx={32} cy={32} r={32} />
                  </g>
                  <g className="st1">
                    <path
                      className="st2"
                      d="M32,12c-12.1,0-22,9.9-22,22s9.9,22,22,22c3.5,0,7-0.8,10.1-2.4c1-0.5,1.4-1.7,0.9-2.7s-1.7-1.4-2.7-0.9
                     c-2.6,1.3-5.3,2-8.2,2c-9.9,0-18-8.1-18-18s8.1-18,18-18s18,8.1,18,18c0,3-0.8,6-2.2,8.6c-1.8-1.4-4.4-4.2-4.4-8.5v-8.8
                     c0-1.1-0.9-2-2-2s-2,0.9-2,2v0.1c-2-1.7-4.6-2.8-7.4-2.8c-6.3,0-11.4,5.1-11.4,11.4S25.7,45.4,32,45.4c3.7,0,7-1.8,9.1-4.6
                     c2.3,4.2,6.2,6.3,6.4,6.4c0.9,0.5,2,0.2,2.6-0.6c2.6-3.7,3.9-8,3.9-12.6C54,21.9,44.1,12,32,12z M32,41.4c-4.1,0-7.4-3.3-7.4-7.4
                     c0-4.1,3.3-7.4,7.4-7.4s7.4,3.3,7.4,7.4C39.4,38.1,36.1,41.4,32,41.4z"
                    />
                  </g>
                  <g>
                    <path
                      className="st3"
                      d="M32,54c-12.1,0-22-9.9-22-22s9.9-22,22-22s22,9.9,22,22c0,4.5-1.4,8.9-3.9,12.6c-0.6,0.8-1.7,1.1-2.6,0.6
                     c-0.3-0.2-8.1-4.2-8.1-13.1v-8.8c0-1.1,0.9-2,2-2c1.1,0,2,0.9,2,2v8.8c0,4.3,2.6,7.1,4.4,8.5C49.2,38,50,35,50,32
                     c0-9.9-8.1-18-18-18s-18,8.1-18,18s8.1,18,18,18c2.9,0,5.7-0.7,8.2-2c1-0.5,2.2-0.1,2.7,0.9c0.5,1,0.1,2.2-0.9,2.7
                     C39,53.2,35.5,54,32,54z"
                    />
                  </g>
                  <g>
                    <path
                      className="st3"
                      d="M32,24.6c4.1,0,7.4,3.3,7.4,7.4s-3.3,7.4-7.4,7.4s-7.4-3.3-7.4-7.4S27.9,24.6,32,24.6 M32,20.6
                     c-6.3,0-11.4,5.1-11.4,11.4S25.7,43.4,32,43.4S43.4,38.3,43.4,32S38.3,20.6,32,20.6L32,20.6z"
                    />
                  </g>
                </g>
                <g id="Layer_2"></g>
              </svg>
            </a>
          </li>
        </ul>
      </div>
      <span className="blue heading-type typing-text" ref = {el}/>
    </div>
    <div className="blob">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1000 1000"
        fill="#434646"
      >
        <path>
          <animate
            repeatCount="indefinite"
            dur="21s"
            attributeName="d"
            values="
    M696.194 45.0455C839.4 105.861 1012.59 394.455 996.992 546.346C981.397 698.236 751.009 925.232 602.621 956.389C454.233 987.547 184.14 862.447 106.663 733.291C29.1848 604.134 39.4994 296.158 137.755 181.451C236.01 66.7431 552.988 -15.7704 696.194 45.0455Z;
    
    M681.785 78.4576C821.331 136.985 1004.51 405.67 989.893 545.684C975.281 685.697 736.841 889.923 594.11 918.537C451.379 947.151 207.091 838.038 133.508 717.368C59.9263 596.699 61.2373 301.005 152.617 194.52C243.996 88.0351 542.239 19.9303 681.785 78.4576Z;
    
    M664.253 119.112C795.966 174.704 972.371 413.893 959.723 542.87C947.074 671.848 722.958 865.739 588.363 892.979C453.767 920.219 221.97 820.255 152.15 706.312C82.3306 592.368 84.0943 307.185 169.445 209.318C254.795 111.452 532.54 63.5203 664.253 119.112Z;
    
    M658.685 132.024C781.758 184.804 934.82 412.233 923.19 539.464C911.561 666.694 716.957 867.87 588.909 895.407C460.86 922.943 222.258 816.785 154.9 704.681C87.541 592.577 100.793 318.227 184.757 222.784C268.722 127.341 535.613 79.2441 658.685 132.024Z;
    
    M669.794 106.264C787.26 157.109 912.726 400.998 900.326 537.331C887.927 673.664 722 894.967 595.397 924.262C468.794 953.556 207.351 828.433 140.707 713.099C74.0626 597.765 107.351 333.398 195.532 232.259C283.713 131.12 552.328 55.4185 669.794 106.264Z;
    
    M688.083 63.8525C805.431 114.152 917.73 387.944 903.699 537.646C889.668 687.348 735.296 930.313 603.897 962.066C472.498 993.82 182.685 849.201 115.305 728.165C47.9242 607.129 104.151 346.567 199.614 235.848C295.077 125.129 570.736 13.5528 688.083 63.8525Z;
    
    M697.919 41.0443C820.464 92.2777 946.231 382.754 931.454 540.234C916.678 697.714 749.678 951.997 609.262 985.923C468.845 1019.85 157.8 869.309 88.9542 743.794C20.1082 618.279 94.6917 349.959 196.186 232.834C297.68 115.709 575.375 -10.1891 697.919 41.0443Z;
    
    M690.894 57.3365C821.294 110.946 982.111 389.666 968.336 543.673C954.56 697.681 757.58 946.382 608.241 981.382C458.901 1016.38 142.683 879.933 72.2984 753.672C1.91391 627.412 82.835 339.875 185.934 223.819C289.033 107.763 560.493 4.02738 690.894 57.3365Z;
    
    M673.012 98.802C810.205 154.713 1006 404.008 994.069 546.073C982.143 688.138 755.12 916.571 601.453 951.194C447.785 985.817 143.822 877.242 72.0651 753.811C0.307817 630.38 70.7514 319.774 170.909 210.906C271.067 101.438 535.819 42.8908 673.012 98.802Z;
    
    M659.56 129.995C799.626 188.374 1005.6 415.506 994.51 546.114C983.418 676.722 744.036 880.936 593.009 913.643C441.982 946.649 161.497 863.787 88.3484 744.153C15.1997 624.519 58.9148 298.199 154.117 195.839C249.319 93.4796 519.495 71.6157 659.56 129.995Z;
    
    M662.038 124.25C800.454 184.467 981.751 415.904 969.415 543.774C957.08 671.645 730.498 860.969 588.025 891.473C445.551 922.278 189.423 846.767 114.572 728.6C39.7202 610.433 47.672 283.197 138.916 182.472C230.161 81.7473 523.621 64.0335 662.038 124.25Z;
    
    M678.326 86.4794C812.365 147.673 947.381 405.067 932.58 540.339C917.778 675.612 721.591 869.265 589.518 898.114C457.445 926.963 217.004 834.256 140.142 713.434C63.2805 592.612 38.6511 277.672 128.348 173.179C218.046 68.6867 544.288 25.286 678.326 86.4794Z;
    
    M694.502 48.9694C824.456 110.282 920.571 390.935 904.251 537.697C887.931 684.459 721.504 901.694 596.584 929.541C471.664 957.389 233.408 831.401 154.731 704.781C76.0551 578.16 34.5653 279.121 124.527 169.819C214.489 60.5168 564.548 -12.3438 694.502 48.9694Z;
    
    M696.737 43.7852C825.368 104.492 915.301 383.479 900.002 537.301C884.703 691.124 729.537 938.582 604.944 966.721C480.352 994.86 231.901 838.412 152.447 706.136C72.9921 573.86 37.5016 283.455 128.217 173.063C218.932 62.6717 568.106 -16.9211 696.737 43.7852Z;
    
    M683.122 75.3584C813.703 134.876 934.432 387.406 922.168 539.368C909.903 691.331 740.86 957.536 609.534 987.134C478.208 1016.73 212.687 851.097 134.211 716.952C55.7352 582.807 47.1944 289.196 138.68 182.264C230.165 75.3319 552.541 15.841 683.122 75.3584Z;
    
    M665.294 116.699C799.418 174.563 968.184 399.143 958.564 542.762C948.944 686.382 749.436 946.732 607.573 978.415C465.711 1010.1 183.015 863.332 107.39 732.859C31.7644 602.387 60.8381 298.274 153.822 195.58C246.806 92.8868 531.17 58.8356 665.294 116.699Z;
    
    M658.489 132.479C794.915 188.363 998.834 410.035 989.131 545.613C979.428 681.19 751.316 912.311 600.272 945.943C449.228 979.575 154.483 870.01 82.8666 747.404C11.2503 624.799 74.6374 312.799 170.574 210.312C266.512 107.824 522.063 76.5957 658.489 132.479Z;
    
    M668.534 109.186C803.783 162.978 1009.95 413.037 997.197 546.365C984.441 679.693 746.463 874.417 592 909.154C437.537 943.891 138.134 869.045 70.4179 754.788C2.70129 640.531 86.0143 331.213 185.7 223.613C285.386 116.013 533.285 55.3939 668.534 109.186Z;
    
    M686.832 66.7543C817.189 118.733 994.699 407.292 978.197 544.593C961.695 681.894 738.319 856.003 587.819 890.562C437.32 925.122 140.494 861.591 75.201 751.951C9.90749 642.311 94.1202 346.921 196.059 232.722C297.997 118.523 556.476 14.7758 686.832 66.7543Z;
    
    M697.746 41.4453C821.581 92.3493 960.546 397.962 942.629 541.276C924.711 684.591 731.474 868.2 590.241 901.332C449.009 934.464 160.338 850.982 95.2342 740.069C30.1305 629.156 99.2 352.29 199.619 235.852C300.037 119.415 573.911 -9.45862 697.746 41.4453Z;
    
    M691.947 54.894C811.01 105.871 925.736 391.563 910.044 538.238C894.353 684.912 729.068 903.989 597.798 934.94C466.528 965.891 189.447 841.035 122.426 723.942C55.404 606.848 100.748 343.886 195.668 232.378C290.588 120.87 572.884 3.91749 691.947 54.894Z;
    
    M674.391 95.6039C793.284 147.963 909.767 391.243 898.354 537.148C886.941 683.052 731.34 942.208 605.913 971.03C480.486 999.853 215.945 834.755 145.792 710.083C75.6394 585.41 96.8973 325.408 184.997 222.995C273.097 120.581 555.498 43.245 674.391 95.6039Z;
    
    M660.087 128.775C784.127 183.613 922.388 395.444 913.985 538.605C905.583 681.767 736.019 960.162 609.671 987.743C483.323 1015.32 229.217 833.785 155.895 704.091C82.5735 574.396 85.7087 305.464 169.741 209.578C253.772 113.692 536.046 73.9371 660.087 128.775Z;
    
    M661.261 126.052C793.827 183.884 957.422 400.325 948.344 541.809C939.267 683.293 740.078 947.193 606.796 974.956C473.514 1002.72 224.295 838.409 148.654 708.385C73.0133 578.362 67.5159 291.869 152.95 194.813C238.385 97.7579 528.695 68.219 661.261 126.052Z;
    
    M676.863 89.872C817.606 150.424 995.446 403.219 982.477 544.992C969.508 686.765 741.62 911.144 599.051 940.511C456.481 969.878 203.899 847.665 127.06 721.193C50.2209 594.722 46.3839 286.902 138.018 181.682C229.652 76.462 536.12 29.3203 676.863 89.872Z;
    
    M696.194 45.0455C839.4 105.861 1012.59 394.455 996.992 546.346C981.397 698.236 751.009 925.232 602.621 956.389C454.233 987.547 184.14 862.447 106.663 733.291C29.1848 604.134 39.4994 296.158 137.755 181.451C236.01 66.7431 552.988 -15.7704 696.194 45.0455Z
    "
          />
        </path>
      </svg>
    </div>
  </header>
  <section id="about">
    <div className="title">About</div>
    <div className="about-grid">
      <div className="about-img">
        <img className="about-me-me" src="./files/ME2.jpg"/>
      </div>
      <div className="about-text-container">
        <p className="about-text">
          My name is Ashrit Ram Anala and I am a freshman at{" "}
          <a><span className="bolded">Vanderbilt University</span></a> working towards
          a{" "}
          <a><span className="bolded">Bachelor's Degree in Computer Science & Minor in Data Science</span></a>{""}
        . I have
          experience in Full Stack development and am currently very interested
          in databases and developing web applications using technologies like
          Java Spring, MongoDB, and Firebase. I am also interested in machine
          learning and security with JWT and am exploring how I can implement them into my own projects and projects for organizations I am a part of.
          Outside of the tech sphere I love to swim casually, make meaningful
          connections, and explore the world around me.
        </p>
      </div>
    </div>
  </section>
  <section id="education">
    <div className="title">Education</div>
    <div className="education">
      <div className="college gap bolded">Vanderbilt University</div>
      <div className="education-desc">
        <div className="major-year gap education-subtitle">
          B.S. In Computer Science, Minor In Data Science | 2024 - (2027)
        </div>
        <div className="coursework gap">
          <p>
            <span style={{ color: "white" }}>Relevant Coursework:</span> DS 1000 (Data Science in R), DS 1101 (Data Science in Python), CS 1101 (Java), CS 1151 (CS Ethics), CS 2201 (Data Structures & Algorithms), CS 2212 (Discrete Structures), CS 3251 (Intermediate Software Design)
          </p>
        </div>
        <div className="activities gap1">
          <p>
            <span style={{ color: "white" }}>Clubs &amp; Organizations:</span> Change++, VandyHacks, Vanderbilt Asian Pre-Professional Society (VAPS), Vanderbilt Blockchain, Vanderbilt Data Science Club, Google Developer Group (GDG)
          </p>
        </div>
      </div>
    </div>
    <div className="education ed1">
      <div className="college gap bolded">Chelmsford High School</div>
      <div className="education-desc">
        <div className="major-year gap education-subtitle">
          High School Diploma | 2020 - 2024
        </div>
        <div className="coursework gap">
          <p>
            <span style={{ color: "white" }}>Relevant Coursework:</span> AP
            Calculus BC, AP Statistics, AP Physics 1, AP Physics C: Mechanics,
            AP Computer Science Principles, AP Computer Science A, AP English
            Language and Composition, AP English Literature and Composition
          </p>
        </div>
        <div className="activities gap1 bot">
          <p>
            <span style={{ color: "white" }}>Clubs &amp; Activities:</span>{" "}
            Coding Club (Founder &amp; Captain), Math Team (Captain), Physics
            &amp; Engineering Club (Captain), Science Team, Investing Club,
            National Honor Society, National English Honor Society, World
            Language Honor Society (French)
          </p>
        </div>
      </div>
    </div>
  </section>
  <section>
    <div className="skills">
      <p className="title">Skills &amp; Technologies</p>
 
      <p className="specifics1">Languages & Frameworks</p>
      <ul>
      <li>
          <a>Java</a>
        </li>
        <li>
          <a>Spring</a>
        </li>
        <li>
          <a>Typescript</a>
        </li>
        <li>
          <a>Javascript</a>
        </li>
        <li>
          <a>React</a>
        </li>
        <li>
          <a>Node</a>
        </li>
        <li>
          <a>Express</a>
        </li>
        <li>
          <a>Next</a>
        </li>
        <li>
          <a>JQuery</a>
        </li>
        <li>
          <a>Python</a>
        </li>
        <li>
          <a>Flask</a>
        </li>
        <li>
          <a>R</a>
        </li>
        <li>
          <a>C++</a>
        </li>
        <li>
          <a>HTML</a>
        </li>
        <li>
          <a>CSS</a>
        </li>
        <li>
          <a>Tailwind CSS</a>
        </li>
        <li>
          <a>DaisyUI</a>
        </li>
      </ul>

      <p className="specifics">Technologies</p>
      <ul>
        <li>
          <a>PostgreSQL</a>
        </li>
        <li>
          <a>MongoDB</a>
        </li>
        <li>
          <a>Firebase</a>
        </li>
        <li>
          <a>AWS</a>
        </li>
        <li>
          <a>Docker</a>
        </li>
        <li>
          <a>Vercel</a>
        </li>
        <li>
          <a>Heroku</a>
        </li>
        <li>
          <a>Render</a>
        </li>
        <li>
          <a>Postman</a>
        </li>
        <li>
          <a>Thunder Client</a>
        </li>
        <li>
          <a>Jest</a>
        </li>
      </ul>

      <p className="specifics">Skills</p>
      <ul>
        <li>
          <a>Logistic Regression</a>
        </li>
        <li>
          <a>NLP</a>
        </li>
        <li>
          <a>Sentiment Analysis</a>
        </li>
        <li>
          <a>RESTful APIs</a>
        </li>
        <li>
          <a>Git</a>
        </li>
        <li>
          <a>Agile Methodologies</a>
        </li>
        <li>
          <a>Responsive Design</a>
        </li>
        <li>
          <a>Figma</a>
        </li>
        <li>
          <a>Public Speaking</a>
        </li>
        <li>
          <a>Collaboration</a>
        </li>
      </ul>
    </div>
  </section>
  <section>
    <p className="title" id="work">
      Experience
    </p>
    <div className="work">

    <div className="experience">
        <ul>
          <div className="date">
            <p>Sept 2024 - Present</p>
          </div>
          <div className="description">
            <div className="subtitle">
              Developer @{" "}
              <span className="bolded">
              <a href="https://www.changeplusplus.org/" target="_blank">
                <span className="bolded-link">Foster Source </span>
              </a>
              </span>
            </div>
            <p className="summary">
           
              Through Change++, a Vanderbilt nonprofit organization that partners with other local and national nonprofits to provide them with pro bono software, I am 1 of 8 developers for
              <a href="https://fostersource.org/" target="_blank">
                <span className="bolded-link"> Foster Source</span>
              </a>
              , a national nonprofit that serves 
              <a>
                <span className="bolded-link"> 4,000+ Families </span>
              </a>
              in 
              <a>
                <span className="bolded-link"> 48 states </span>
              </a>
               to provide necessary learning materials for foster parents when taking on a foster child. Final results are projected to 
              <a>
                <span className="bolded-link"> reduce query time </span>
              </a>
               by 
              <a>
                <span className="bolded-link"> 70% </span>
              </a>
              through the implementation of optimized endpoints and schemas, 
              <a>
                <span className="bolded-link"> increase revenue </span>
              </a>
              by              
              <a>
                <span className="bolded-link"> 20% </span>
              </a> throughthe implementation of more efficient and user friendly Stripe Payment integration, increase security heavily through JWT and Firebase to handle 
              <a>
                <span className="bolded-link"> 1,000+ </span>
              </a>
              authenticated 
              <a>
                <span className="bolded-link"> users </span>
              </a>
              daily, save 
              <a>
                <span className="bolded-link"> $23K+ </span>
              </a>
              with the new LMS (Learning Model System) we are making, and add an extra layer of security with middleware for the
            <a>
                <span className="bolded-link"> $1,000,000+ </span>
              </a>
             revenue Foster Source generates annually{" "}
            </p>

            <div className="tech">
              <ul>
                <li>
                  <a>Typescript</a>
                </li>
                <li>
                  <a>React</a>
                </li>
                <li>
                  <a>Node</a>
                </li>
                <li>
                  <a>Express</a>
                </li>
                <li>
                  <a>MongoDB</a>
                </li>
                <li>
                  <a>Firebase Authentication</a>
                </li>
                <li>
                  <a>JSON Web Token (JWT)</a>
                </li>
                <li>
                  <a>Stripe Payments</a>
                </li>
              </ul>
            </div>
          </div>
        </ul>
      </div>

      <div className="experience">
        <ul>
          <div className="date">
            <p>Apr 2023 - Present</p>
          </div>
          <div className="description">
            <div className="subtitle">
              Chief Technology Officer @{" "}
              <span className="bolded">
              <a href="https://www.silverlineadvisory.org/" target="_blank">
                <span className="bolded-link">Silverline Educational Adivsory Services </span>
              </a>
               
              </span>
            </div>
            <p className="summary">
              Silverline Educational Advisory Services is an international
              nonprofit organization present in over 66 countries aimed to aid
              high school students. I helped assemble and collaborated with a
              team of 10 web developers to aid in creating the website and
              assembling fine-tuning data for machine learning models we would
              develop. I later soon developed the Silverline AI Chatbot tailored
              specifically for high school students to have a quick and reliable
              source of information using this fine-tune data. The Silverline AI
              can be found at{" "}
              <a href="https://ai.silverlineadvisory.org" target="_blank">
                <span className="bolded-link">ai.silverlineadvisory.org</span>
              </a>
            </p>
            <div className="tech">
              <ul>
                <li>
                  <a>React</a>
                </li>
                <li>
                  <a>CSS</a>
                </li>
                <li>
                  <a>Python</a>
                </li>
                <li>
                  <a>OpenAI API</a>
                </li>
                <li>
                  <a>Docker</a>
                </li>
              
                <li>
                  <a>Render</a>
                </li>
              </ul>
            </div>
          </div>
        </ul>
      </div>
      <div className="experience">
        <ul>
          <div className="date">
            <p>Jul 2022 - Feb 2023</p>
          </div>
          <div className="description">
            <div className="subtitle">
              Research Intern @{" "}
              <span className="bolded">
              <a href="https://www.uml.edu/research/nerve/" target="_blank">
                <span className="bolded-link">The University of Massachusetts Lowell</span>
              </a>
              </span>
            </div>
            <p className="summary">
              I collaborated with graduate students at the University of
              Massachusetts Lowell to aid in developing the following research
              paper "Fabric-Embedded Dynamic Sensing for Adaptive Exoskeleton
              Assistance". In February of 2023, the paper received an{" "}
              <a
                href="https://www.nsf.gov/awardsearch/showAward?AWD_ID=1955979&HistoricalAwards=false"
                target="_blank"
              >
                <span className="bolded">NSF Grant Award</span>
              </a>{" "}
              with award number 1955979 totaling to over{" "}
              <a>
              <span className="bolded">$620,000</span>
              </a>
            </p>
            <div className="tech">
              <ul>
                <li>
                  <a>C++</a>
                </li>
                <li>
                  <a>Python</a>
                </li>
                <li>
                  <a>SolidWorks</a>
                </li>
                <li>
                  <a>CAD</a>
                </li>
                <li>
                  <a>JSON</a>
                </li>
                
              </ul>
            </div>
          </div>
        </ul>
      </div>
    </div>
  </section>
  <section id="op">
    <div className="projects-grid" />
  </section>
  
  <section>
    <p className="title" id="projects">
      Personal Projects
    </p>
    <div className="projects-grid1">
      <a href="https://github.com/ashrit-ram-anala/GeoBet-WebApp"target="_blank" style={{textDecoration: "none"}}>
      <div className="op-card">
        <div className="card-details">
          <p className="text-title" style={{textAlign:"center"}}>GEO-BET</p>
          <div className="text-body">
           Geo-Bet is a <span style={{color: "white"}}>Full Stack </span> web application that allows uers to answer Geography Trivia with a Casino-esque twist. The WebApp currently has <span style={{color: "white"}}>200+ organic users</span> with the top 25 displayed on the in game leaderboard. The frontend is programmed in React + Vite with Firebase login and Authentication and the backend is programmed in Node and Express with a MongoDB database for the leaderboard of best trivia rounds.
          </div>
          <div className="op-tech-stack">REACT VITE NODE EXPRESS MONGODB FIREBASE TAILWIND</div>
          
        </div>
      
       
      </div>
      </a>
      <a href="https://github.com/ashrit-ram-anala/VandyHacks-XI-Project"target="_blank" style={{textDecoration: "none"}}>
      <div className="op-card">
        <div className="card-details">
          <p className="text-title" style={{textAlign:"center"}}>SMART STOCK</p>
          <div className="text-body">
          Smart-Stock is a web application made for <span style={{color: "white"}}>VandyHacks XI </span> that allows users to enter specific stock tickers (AAPL, AMZN, etc.) and see the public sentiment for those stocks at that very moment as well as historical sentiment from over <span style={{color: "white"}}>20K+ posts </span>. Smart-Stock utilizes the Reddit API and performs <span style={{color: "white"}}>Sentiment Analysis </span> with the Perplexity LLM and Python TextBlob. The sentiments are displayed and graphed with Chart.JS.
          </div>
          <div className="op-tech-stack">REACT VITE NODE EXPRESS MONGODB FLASK TAILWIND</div>
        </div>
       
      </div>
      </a>
    </div>
    
    <div className="projects-grid1">
      <a href="https://github.com/ashrit-ram-anala/ML-Projects"target="_blank" style={{textDecoration: "none"}}>
      <div className="op-card">
        <div className="card-details">
          <p className="text-title" style={{textAlign:"center"}}>LOAN DEFAULT PREDICTOR</p>
          <div className="text-body">
          I Developed a Machine Learning Logistic Regression model to allow banks to determine if a user will default on a loan based on <span style={{color: "white"}}>20+ attributes</span>. Programmed in R and has final C-Statistic &gt; <span style={{color: "white"}}>0.8</span>, indicating a strong model, with potential savings of <span style={{color: "white"}}>$1,000,000+ </span> for the dataset company when implemented.
          </div>
          <div className="op-tech-stack">R LOGISTIC REGRESSION</div>
        </div>
       
      </div>
      </a>
      <a style={{textDecoration: "none"}}>
      <div className="op-card">
        <div className="card-details">
          <p className="text-title" style={{textAlign:"center"}}>VANDERBILT SCHEDULER</p>
          <div className="text-body">
            This is a current work in progress application that utilizes a web scraper to scrape the <span style={{color: "white"}}>Vanderbilt University </span> finals schedule PDF and generate a table in PostgreSQL. The WebApp allows all <span style={{color: "white"}}>7K+ Vanderbilt undergraduate students </span>to search a course and add the final to their Google Calendar without having to manually and tediously search through the given PDF.
          </div>
          <div className="op-tech-stack">JAVA SPRING ANGULAR TYPESCRIPT POSTGRESQL FIREBASE TAILWIND</div>
        </div>
      </div>
      </a>
    </div>
    <div style={{display:"flex",justifyContent:"center"}}>
    <button
        onClick={handleToggle} 
        className = "btn"
      >
        {isVisible ? 'View Less' : 'View More'}
      </button>
      </div>
      {isVisible && (
         <div className="projects-grid">
         <a href="https://github.com/ashrit-ram-anala/YTSave-Chrome-Extension" target="_blank" style={{textDecoration: "none"}}>
         <div className="op-card">
           <div className="card-details">
             <p className="text-title" style={{textAlign:"center"}}>YTSAVE CHROME EXTENSION</p>
             <div className="text-body">
             I created YTSave, a Chrome Extension aimed to aid students in the studying process by allowing them to create bookmarks they can come back to and access from anywhere while watching a YouTube video instead of scrolling through the video to find the desired timestamp YTSave has <span style={{color: "white"}}>100+ users </span> in <span style={{color: "white"}}>20+ countries</span>.
             </div>
             <div className="op-tech-stack">JAVASCRIPT HTML CSS</div>
           </div>
          
         </div>
         </a>
         <a style={{textDecoration: "none"}}>
         <div className="op-card">
           <div className="card-details">
             <p className="text-title" style={{textAlign:"center"}}>THIS WEBSITE!</p>
             <div className="text-body">
               This very website is another project of mine. The design and layout was created by me using Figma and emulates a <span style={{color: "white"}}>professional resumé </span> with my own <span style={{color: "white"}}>minimalistic </span> but <span style={{color: "white"}}>space themed style</span> to it. The website utilizes React.JS, Tailwind CSS, and DaisyUI to generate all that you see here. Keep scrolling for more!
             </div>
             <div className="op-tech-stack">REACT TAILWIND DAISYUI FIGMA</div>
           </div>
         </div>
         </a>
       </div>
      )}
   
  </section>
  <section id="honors">
    <p className="title">Honors</p>
    <div className="honors">
      <div className="img">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000000"
            strokeWidth="9.216"
          >
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
        </svg>
      </div>
      <div className="img">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000000"
            strokeWidth="9.216"
          >
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
        </svg>
      </div>
      <div className="img">
        <svg
          width="100px"
          height="100px"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          fill="#000000"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth={0} />
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
            stroke="#000000"
            strokeWidth="9.216"
          >
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
          <g id="SVGRepo_iconCarrier">
            <path
              fill="#8c8c8c"
              d="M134.594 73.375c-17.522 5.65-31.232 11.854-48.125 24.25-2.19 2.097-4.337 4.22-6.44 6.406.24.566.61 1.265 1.157 2.25 1.016 1.832 2.767 4.023 4.97 6.19-3.454 5.536-6.596 11.072-9.5 16.624-3.664-3.04-6.952-6.423-9.594-10.22-7.617 9.505-14.475 19.678-20.438 30.44.395 1.636 1.557 3.42 3.78 5.81 2.656 2.853 6.805 5.8 11.626 8.314-2.024 6.117-3.76 12.204-5.186 18.28-7.44-3.38-14.245-7.768-19.594-13.343-5.94 13.804-10.473 28.42-13.406 43.656 1.335 2.434 3.714 4.663 7.312 7.032 5.072 3.34 12.36 6.076 20.282 7.657-.045 6.437.25 12.822.812 19.124-11.407-1.673-22.405-5.248-31.375-11.156-.05-.034-.106-.06-.156-.094-1.31 15.59-.872 30.96 1.093 45.906 2.31 3.48 6.176 5.957 11.937 7.938 7.406 2.546 17.472 3.344 27.72 2.312 2 6.122 4.275 12.13 6.81 18-13.97 2.098-28.237 1.622-40.593-2.625-.337-.116-.665-.252-1-.375 3.978 15.49 9.66 30.37 16.844 44.406 3.553 2.804 8.35 4.216 14.72 4.656 9.3.644 21.144-1.73 32.438-6.343 3.712 5.257 7.63 10.34 11.75 15.25-14.57 6.715-30.36 10.975-45.063 9.75 9.952 14.602 21.638 27.964 34.844 39.75 4.26 1.446 9.3 1.465 15.374.28 9.6-1.873 20.855-7.404 31.03-15 .008.005.026-.005.032 0 5.154 3.978 10.476 7.75 15.906 11.25-11.976 9.91-25.625 17.696-39.53 21.22 11.654 7.88 24.148 14.67 37.343 20.186 4.937.423 10.29-.96 16.344-3.906 7.672-3.735 15.78-10.252 23.03-18.28 17.036 6.783 34.732 11.22 52.563 12.905l1.78-18.625c-14.268-1.35-28.584-4.77-42.562-9.938 6.883-11.108 11.61-23.173 12.94-33.437 1.178-9.114.083-16.157-3.782-21.438-8.08-1.58-15.89-3.94-23.375-7-.172 6.47-1.706 12.987-4.22 19.094-3.745 9.103-9.52 17.798-16.53 25.72-5.353-3.288-10.565-6.832-15.657-10.925 6.62-7.182 11.923-14.97 14.906-22.22 3.806-9.246 4.173-16.578.625-22.81-7.748-4.957-15.003-10.737-21.718-17.22-1.773 4.3-4.187 8.37-7.032 12.094-5.476 7.165-12.572 13.51-20.563 18.905-4.12-4.72-8.052-9.603-11.75-14.688 7.152-4.694 13.296-10.1 17.47-15.562 5.038-6.594 7.22-12.41 6.468-18.094-4.976-6.553-9.494-13.582-13.5-21-2.285 2.686-4.86 5.14-7.657 7.283-6.758 5.175-14.798 9.155-23.406 12.03-2.595-5.69-4.957-11.498-7-17.437 7.427-2.405 14.13-5.683 19.03-9.437 5.696-4.362 8.802-8.545 9.532-13.25-3.03-7.998-5.508-16.32-7.406-24.908-1.878 1.075-3.82 2.024-5.812 2.813-7.45 2.947-15.75 4.434-24.28 4.75-.662-6.16-1.027-12.403-1.033-18.72 6.957-.263 13.464-1.437 18.44-3.405 4.6-1.82 7.595-3.8 9.343-6.25-1.018-9.72-1.33-19.69-.813-29.813-.65.104-1.29.18-1.938.25-6.624.725-13.556.15-20.406-1.343 1.37-5.98 3.07-12.01 5.094-18.063 4.87.933 9.538 1.223 13.28.814 2.614-.286 4.532-.756 6-1.406 1.395-8.93 3.407-17.644 5.97-26.032-4.182-.736-8.284-2.092-12.25-3.875 2.834-5.457 5.926-10.928 9.344-16.405 2.414.963 4.716 1.665 6.687 1.97 1.107.17 2.023.265 2.782.28 1.946-4.64 4.022-9.17 6.282-13.563 5.898-11.802 12.415-24.25 17-37.937zm244.375 0c4.583 13.686 11.1 26.135 17 37.938 2.26 4.393 4.366 8.923 6.31 13.562.752-.016 1.66-.113 2.75-.28 1.98-.306 4.296-1 6.72-1.97 3.418 5.477 6.51 10.948 9.344 16.406-3.976 1.786-8.096 3.14-12.28 3.876 2.563 8.39 4.573 17.1 5.967 26.03 1.474.658 3.404 1.12 6.033 1.408 3.742.41 8.41.12 13.28-.813 2.026 6.063 3.692 12.104 5.063 18.095-6.837 1.487-13.762 2.036-20.375 1.313-.656-.072-1.308-.145-1.967-.25.517 10.124.236 20.092-.782 29.812 1.75 2.45 4.745 4.43 9.345 6.25 4.967 1.965 11.462 3.14 18.406 3.406-.006 6.316-.37 12.56-1.03 18.72-8.52-.32-16.808-1.808-24.25-4.75-1.994-.79-3.933-1.74-5.813-2.814-1.895 8.575-4.383 16.89-7.406 24.875.715 4.72 3.795 8.912 9.5 13.282 4.904 3.753 11.605 7.03 19.033 9.436-2.044 5.94-4.405 11.747-7 17.438-8.598-2.875-16.624-6.862-23.375-12.03-2.804-2.148-5.4-4.592-7.688-7.283-4.01 7.422-8.52 14.444-13.5 21-.76 5.682 1.43 11.502 6.47 18.095 4.168 5.457 10.313 10.87 17.467 15.563-3.697 5.085-7.63 9.966-11.75 14.687-7.99-5.396-15.086-11.74-20.562-18.906-2.838-3.715-5.234-7.778-7-12.064-6.71 6.478-13.976 12.236-21.72 17.188-3.547 6.233-3.18 13.565.626 22.812 2.985 7.25 8.288 15.037 14.908 22.22-5.095 3.795-10.333 7.334-15.688 10.924-7.003-7.922-12.754-16.617-16.5-25.72-2.513-6.106-4.047-12.623-4.22-19.092-7.497 3.064-15.313 5.418-23.405 7-3.873 5.28-4.96 12.324-3.78 21.437 1.327 10.264 6.08 22.33 12.967 33.438-13.974 5.168-28.293 8.587-42.562 9.937l1.75 18.625c17.84-1.687 35.546-6.116 52.594-12.906 7.25 8.028 15.358 14.545 23.03 18.28 6.056 2.947 11.408 4.33 16.345 3.906 13.2-5.517 25.684-12.302 37.342-20.187-13.896-3.52-27.562-11.293-39.53-21.19 5.442-3.504 10.74-7.293 15.906-11.28 10.18 7.604 21.456 13.126 31.062 15 6.056 1.182 11.09 1.185 15.344-.25 13.212-11.788 24.92-25.172 34.875-39.78-14.705.925-30.526-3.035-45.095-9.75 4.12-4.913 8.066-9.99 11.78-15.25 11.295 4.61 23.138 6.986 32.44 6.342 6.368-.44 11.166-1.852 14.717-4.656 7.183-14.036 12.867-28.917 16.844-44.406-.335.123-.663.26-1 .375-12.355 4.247-26.623 4.723-40.594 2.625 2.536-5.87 4.813-11.878 6.813-18 10.236 1.027 20.29.23 27.688-2.313 5.765-1.98 9.65-4.455 11.968-7.937 1.965-14.946 2.372-30.318 1.064-45.906-.043.028-.082.065-.125.094-8.97 5.908-19.97 9.483-31.376 11.156.563-6.302.856-12.687.812-19.125 7.92-1.582 15.21-4.317 20.28-7.657 3.593-2.366 5.946-4.604 7.283-7.032-2.934-15.234-7.47-29.852-13.408-43.655-5.347 5.57-12.133 9.96-19.562 13.344-1.427-6.078-3.162-12.165-5.188-18.282 4.805-2.513 8.942-5.464 11.594-8.313 2.212-2.376 3.402-4.15 3.813-5.78-5.97-10.774-12.814-20.955-20.44-30.47-2.642 3.796-5.93 7.18-9.592 10.22-2.905-5.553-6.047-11.09-9.5-16.626 2.208-2.166 3.953-4.36 4.968-6.19.538-.97.92-1.656 1.156-2.218-2.106-2.193-4.275-4.334-6.468-6.437-16.893-12.396-30.903-18.6-48.125-24.25zM152.81 134.313l24.094 129.718H341l22.906-124.5-57.937 63.5L261 135.845l-45 67.187-63.188-68.718zm27.563 148.406l3.563 19.217H334.03l3.533-19.218H180.375z"
            />
          </g>
        </svg>
      </div>
      <div className="award-title">Wesleyan Book Award</div>
      <div className="award-title">NSF Grant Award</div>
      <div className="award-title">Published Author</div>
      <div className="award-container">
        <li>
          <a>
            <div className="award-type-main">Certification</div>
          </a>
        </li>
        <li>
          <a>
            <div className="award-type">AWS</div>
          </a>
        </li>
      </div>
      <div className="award-container">
        <li>
          <a>
            <div className="award-type-main">Award</div>
          </a>
        </li>
        <li>
          <a>
            <div className="award-type">Research</div>
          </a>
        </li>
        <li>
          <a>
            <div className="award-type">NSF</div>
          </a>
        </li>
      </div>
      <div className="award-container">
        <li>
          <a>
            <div className="award-type-main">Honor</div>
          </a>
        </li>
        <li>
          <a>
            <div className="award-type">E-Book</div>
          </a>
        </li>
      </div>
      <div>
       Received the Wesleyan Book Award in junior year of high school for being within the top 15 students GPA-wise in my high school.
      </div>
      <div>
        Worked with two graduate students to create a research paper that recieved an NSF Grant totaling over $620,000 the following year.
      </div>
      <div>
        Wrote and self published a book on Python that has been given to several schools and distributed to students throughout Massachusetts.
      </div>
    </div>
    <section>
  </section>
    <footer className="footer">
      <span>© 2024 Ashrit Ram Anala</span>
      <div className="footer-social">
       
        <a href="https://github.com/ashrit-ram-anala" target="_blank">
          <svg
            className="github"
            width="15px"
            height="15px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="#a5a5a5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
          </svg>
        </a>
        <a
          href="https://www.linkedin.com/in/ashrit-ram-anala-6a73761b7/"
          target="_blank"
        >
          <svg
            className="linkedin"
            fill="#a5a5a5"
            width="15px"
            height="15px"
            viewBox="0 0 1920 1920"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1168 601.321v74.955c72.312-44.925 155.796-71.11 282.643-71.11 412.852 0 465.705 308.588 465.705 577.417v733.213L1438.991 1920v-701.261c0-117.718-42.162-140.06-120.12-140.06-74.114 0-120.12 23.423-120.12 140.06V1920l-483.604-4.204V601.32H1168Zm-687.52-.792v1318.918H0V600.53h480.48Zm-120.12 120.12H120.12v1078.678h240.24V720.95Zm687.52.792H835.267v1075.316l243.364 2.162v-580.18c0-226.427 150.51-260.18 240.24-260.18 109.55 0 240.24 45.165 240.24 260.18v580.18l237.117-2.162v-614.174c0-333.334-93.573-457.298-345.585-457.298-151.472 0-217.057 44.925-281.322 98.98l-16.696 14.173H1047.88V721.441ZM240.24 0c132.493 0 240.24 107.748 240.24 240.24 0 132.493-107.747 240.24-240.24 240.24C107.748 480.48 0 372.733 0 240.24 0 107.748 107.748 0 240.24 0Zm0 120.12c-66.186 0-120.12 53.934-120.12 120.12s53.934 120.12 120.12 120.12 120.12-53.934 120.12-120.12-53.934-120.12-120.12-120.12Z"
              fillRule="evenodd"
            />
          </svg>
        </a>
        <a href="mailto:ashritramanala@yahoo.com">
          <svg
            className="linkedin"
            fill="#a5a5a5"
            width="15px"
            height="15px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m16.484 11.976 6.151-5.344v10.927zm-7.926.905 2.16 1.875c.339.288.781.462 1.264.462h.017-.001.014c.484 0 .926-.175 1.269-.465l-.003.002 2.16-1.875 6.566 5.639h-20.009zm-6.572-7.516h20.03l-9.621 8.356c-.104.082-.236.132-.38.132-.005 0-.009 0-.014 0h.001c-.004 0-.009 0-.014 0-.144 0-.277-.05-.381-.133l.001.001zm-.621 1.266 6.15 5.344-6.15 5.28zm21.6-2.441c-.24-.12-.522-.19-.821-.19h-20.285c-.3.001-.584.071-.835.197l.011-.005c-.618.309-1.035.937-1.035 1.663v.004 12.168c.001 1.026.833 1.857 1.858 1.858h20.283c1.026-.001 1.857-.833 1.858-1.858v-12.168c0-.001 0-.002 0-.004 0-.727-.419-1.357-1.029-1.66l-.011-.005z" />
          </svg>
        </a>
        <a className="footer-social" href="#home">
          <p className="top">↑ TOP</p>
        </a>
      </div>
    </footer>
    </section>


</>
  )
}

export default App