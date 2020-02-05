import React, { Fragment, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Title from "../../components/home/Welcome";
import Button from '@material-ui/core/Button';
import history from "../../utils/history";
import MaterialTable from 'material-table';
import ServiceProvider from '../../contracts/ServiceProvider';

import getWeb3 from "../../utils/getWeb3";
import Web3Context from "../../utils/Web3Context";
import { useGlobal } from "reactn";


const Services = props => {
  const web3 = React.useContext(Web3Context);
  const [isLoading, setLoading] = React.useState(true);
  const [contract, setContract] = React.useState("");
  const [data, setData] = React.useState([]);
  const [global, setGlobal] = useGlobal();
  let accounts = [];
  let fullServices = [];

  const loadContract = async (web3) => {
    try {
      const networkId = await web3.eth.net.getId();
     
      const deployedServiceProvider = ServiceProvider.networks[networkId];
      const instance = new web3.eth.Contract(
        ServiceProvider.abi,
        deployedServiceProvider && deployedServiceProvider.address,
      );
      accounts = await web3.eth.getAccounts();
      setContract(instance);
      emitAllServices(instance);
     
      console.log("Contract is set");
      return instance;
    } catch (error) {
      alert(
        `Failed to load contract. Check console for details.`,
      );

      console.error(error);
    }
    return null;
  }

  useEffect(() => {
    if (Object.entries(web3).length != 0 && contract == "") {
      loadContract(web3);
    }

  }, [web3, data]);

  // gets cources that were created by the current user, should be available only for service provider
  async function getMyCourcesCodes(contract) {
    var resp = await contract.methods["emitServices"]().call();
    let srvc = resp.events.EmitServices.returnValues.codes;
    let fullServices = [];
    srvc.forEach(function (item) {
      fullServices.push(getFullServiceByCode(item.code))
    });
    return fullServices;
  }

    const getAllServices = async (contract) => {
    let all = await contract.methods.emitAllServices().send({from: accounts[0], wei:1});
    let codes = all.events.EmitServices.returnValues[1];

    for (let i = 0; i < codes.length; i++){
      if(codes[i] == 0){
        codes.splice(i, 1);
        i--;
      }
    }
    return codes;
  } 
  
  // returns a full service object
  function getFullServiceByCode(code, contract) {
    return contract.methods.findServiceByCode(code).call();
  }
  // function for getting all services (useful for all other roles)
  async function emitAllServices(contract) {
    fullServices = [];
    let r = await getAllServices(contract);
    const example = async () => {
    for(const item of r){
      let resp = await getFullServiceByCode(item, contract);
      const service = {
        code: resp.code_,
        serviceName: resp.serviceName,
        serviceType: resp.serviceType,
        location: resp.location,
        startdate: new Date(parseInt(resp.startdate)),
        enddate: new Date(parseInt(resp.enddate)),
        instructor: resp.instructor,
        costs: resp.costs
      };
      fullServices.push(service);
    }       
  }
  example().then(() => {
    setLoading(false);  
    setData(fullServices);    
    return fullServices;
  })
    
  }

  // creates new service
  async function createNewService(service, contract) {
    let newservice = {
      code: service.code,
      serviceType: service.serviceType,
      serviceName: service.serviceName,
      location: service.location,
      startdate: service.startdate,
      enddate: service.enddate,
      instructor: service.instructor,
      costs: service.costs
    }
    if(accounts.length == 0){
      accounts = await web3.eth.getAccounts();
    }
    var resp =  await contract.methods.createService(
      parseInt(service.code),
      service.serviceType.toString(),
      service.serviceName.toString(),
      service.location.toString(),
      service.startdate.getTime(),
      service.enddate.getTime(),
      service.instructor.toString(),
      parseInt(service.costs)
    ).send({from: accounts[0], wei:1});
    data.push(newservice);
    let old = [...data];
    setData([...old]);
  }

  async function updateData(contract) {
    
    // TODO This needs to update the list of services depending on the user role
    // if (serviceProviderRole){
    //   getMyCourcesCodes(contract);
    // } else {
    //   emitAllServices();
    // }
  }

  // this should be called on edit
  async function editService(service, contract) {
    if(accounts.length == 0){
      accounts = await web3.eth.getAccounts();
    }
    var resp = await contract.methods.updateService(
      parseInt(service.code),
      service.serviceType.toString(),
      service.serviceName.toString(),
      service.location.toString(),
      new Date(service.startdate).getTime(),
      new Date(service.enddate).getTime(),
      service.instructor.toString(),
      parseInt(service.costs)
    ).send({from: accounts[0], wei:1});
    let newservice = {
      code: service.code,
      serviceType: service.serviceType,
      serviceName: service.serviceName,
      location: service.location,
      startdate: service.startdate,
      enddate: service.enddate,
      instructor: service.instructor,
      costs: service.costs
    }
    var index = data.indexOf(service);
    if (index !== -1) {
      data[index] = newservice;
    }
    let old = [...data];
    setData([...old]);
  }

  //deleting the service
  async function deleteService(service, contract) {
    if(accounts.length == 0){
      accounts = await web3.eth.getAccounts();
    }

    var resp = await contract.methods.deleteService(service.code).send({from: accounts[0], wei:1});
    data.splice(data.indexOf(service), 1);
    let old = [...data];
    setData([...old]);
  }

  const [state, setState] = React.useState({
    columns: [
      { title: 'Code', field: 'code', type: 'numeric' },
      { title: 'Name', field: 'serviceName' },
      { title: 'Type', field: 'serviceType' },
      { title: 'Location', field: 'location' },
      { title: 'Start Date', field: 'startdate', type: 'date' },
      { title: 'End Date', field: 'enddate', type: 'date' },
      { title: 'Instructor', field: 'instructor' },
      { title: 'Price', field: 'costs', type: 'numeric' },
    ]
  });

  const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    button: {

    },
    marginAutoContainer: {
      width: '100%',
      height: 80,
      display: 'flex',
    },
    marginAutoItem: {
      margin: 'auto'
    },
  }));
  const classes = useStyles();

  if(isLoading) {
    return (
      <h1>Loading</h1>
    );
  }

  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Title title="Services" />
            <div className={classes.marginAutoContainer}>
              <div className={classes.marginAutoItem}>
                {console.log(data)}
                
                <MaterialTable
                  title="My Services"
                  columns={state.columns}
                  data={data}
                  editable={{
                    //@Daniyal can you hide these options for collectors, but allow them to buy services?
                    onRowAdd: newData =>
                      new Promise(resolve => {
                        setTimeout(() => {
                          resolve();
                          setState(prevState => {
                            createNewService(newData, contract);
                            return { ...prevState, data };
                          });
                        }, 600);
                      }),
                    onRowUpdate: (newData, oldData) =>
                      new Promise(resolve => {
                        setTimeout(() => {
                          resolve();
                          if (oldData) {
                            setState(prevState => {
                              editService(newData, contract);
                              return { ...prevState, data };
                            });
                          }
                        }, 600);
                      }),
                    onRowDelete: oldData =>
                      new Promise(resolve => {
                        setTimeout(() => {
                          resolve();
                          setState(prevState => {
                            deleteService(oldData, contract);
                            return { ...prevState, data };
                          });
                        }, 600);
                      }),
                  }}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default Services;
