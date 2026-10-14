/* eslint-disable @next/next/no-img-element */
// Una vez por sesión: el script marca <html> con .no-splash si ya se mostró (antes del primer render, sin parpadeo).
const script = `try{var d=document.documentElement;if(sessionStorage.getItem('fk-splash'))d.classList.add('no-splash');else sessionStorage.setItem('fk-splash','1')}catch(e){}`;

export function Splash({ logo }: { logo: string }) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div className="splash" aria-hidden>
        <img src={logo} alt="" />
      </div>
    </>
  );
}
