import React from 'react';
import Clarety from '../../src';

Clarety.config({
  env: 'dev',
  instanceKey: 'clarety-baseline',
});

const DonateDemo = () => (
  <React.Fragment>
    <main role="main">

      <section className="jumbotron text-center" style={{padding: '6rem'}}>
        <div className="container">
          <h1 className="jumbotron-heading">Layout example</h1>
          <p className="lead text-muted">Something short and leading about the collection below—its contents, the creator, etc. Make it short and sweet, but not too short so folks don’t simply skip over it entirely.</p>
          <p>
            <a href="#" className="btn btn-primary my-2">Call to action</a>
          </p>
        </div>
      </section>

      <div className="container" style={{"marginTop":"5rem"}}>

        <div className="row featurette">
          <div className="col-lg-6">
            <h2 className="featurette-heading" style={{"fontWeight":"400","fontSize":"50px","margin":"7rem 0 2rem"}}>Donate now. <span className="text-muted">Human Fund needs your help.</span></h2>
            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            <p className="lead">Fusce dapibus, tellus ac cursus commodo. Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
          </div>
          <div className="col-lg-6">
              {/* <div id="donate-widget-1" className="h-100"></div> */}

              <Clarety.DonateWidget
                storeCode="AU"
                singleOfferCode="widget-single"
                recurringOfferCode="widget-recurring"
                forceMdLayout
              />
          </div>
        </div>

        <hr style={{"marginTop":"5rem 0"}} />

        <div className="row featurette">
          <div className="col-lg-6">
              <svg className="bd-placeholder-img bd-placeholder-img-lg featurette-image img-fluid mx-auto" width="500" height="500" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: 500x500"><title>Placeholder</title><rect width="100%" height="100%" fill="#eee"></rect><text x="50%" y="50%" fill="#aaa" dy=".3em">500x500</text></svg>
          </div>
          <div className="col-lg-6">
            <h2 className="featurette-heading" style={{"fontWeight":"400","fontSize":"50px","marginTop":"7rem"}}>First featurette heading. <span className="text-muted">It’ll blow your mind.</span></h2>
            <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
          </div>
        </div>

        <hr style={{"marginTop":"5rem 0"}} />

      </div>

      <div className="container">
        <h2 className="featurette-heading" style={{"fontWeight":"400","fontSize":"50px","margin":"7rem 0 3rem","textAlign":"center"}}>Donate now. <span className="text-muted">Human Fund needs your help.</span></h2>

        <Clarety.DonateWidget
          storeCode="AU"
          singleOfferCode="widget-single"
          recurringOfferCode="widget-recurring"
        />
      </div>

    </main>

    <footer className="text-muted bg-light" style={{"marginTop":"5rem","padding":"3rem 0"}}>
      <div className="container">
        <p className="float-right">
          <a href="#">Back to top</a>
        </p>
        <p>Album example is &copy; Bootstrap, but please download and customize it for yourself!</p>
        <p>New to Bootstrap? <a href="https://getbootstrap.com/">Visit the homepage</a> or read our <a href="/docs/4.3/getting-started/introduction/">getting started guide</a>.</p>
      </div>
    </footer>

  </React.Fragment>
);

export default DonateDemo;
