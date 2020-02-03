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

const Services = props => {
  const web3 = React.useContext(Web3Context);
  const [isLoading, setLoading] = React.useState(true);
  const [contract, setContract] = React.useState("");
  const [data, setData] = React.useState("");

  const loadContract = async (web3) => {
    try {
      const networkId = await web3.eth.net.getId();
      const deployedServiceProvider = ServiceProvider.networks[networkId];
      const instance = new web3.eth.Contract(
        ServiceProvider.abi,
        deployedServiceProvider && deployedServiceProvider.address,
      );

      setContract(instance);
      console.log("Contract is set");
    } catch (error) {
      alert(
        `Failed to load contract. Check console for details.`,
      );

      console.error(error);
    }
  }

  useEffect(() => {
    if (Object.entries(web3).length != 0 && contract == "") {
      loadContract(web3);
    }

    if(contract != "") {
      emitAllServices();
    }

  });

  // mockup data, should be removed
  const serviceData = [
    {
      code: 123,
      serviceName: "Frozen 2",
      serviceType: "Movie ticket",
      location: "Accra",
      startdate: "1",
      enddate: "2",
      instructor: "Kristina Prusinskaite",
      costs: "1",
    },
    {
      code: 234,
      serviceName: "Blockchain Minor",
      serviceType: "Education course",
      location: "Accra",
      startdate: "1",
      enddate: "2",
      instructor: "Kristina Prusinskaite",
      costs: "5",
    }
  ];

  // gets cources that were created by the current user, should be available only for service provider
  async function getMyCourcesCodes() {
    var resp = await this.state.contract.methods["emitServices"]().call();
    let srvc = resp.events.EmitServices.returnValues.codes;
    let fullServices = [];
    srvc.forEach(function (item) {
      fullServices.push(getFullServiceByCode(item.code))
    })
    return fullServices;
  }

  // function for getting all services (useful for all other roles)
  async function emitAllServices() {
    var resp = await contract.methods.emitAllServices().call();
    console.log("RESPONSE:");
    console.log(resp);
    if (resp.length > 0){
      let c = resp.events.EmitServices.returnValues.codes;
      let fullServices = [];
      c.forEach(function (item) {
        fullServices.push(getFullServiceByCode(item.code))
      })
  
      console.log(fullServices);
  
      setData(fullServices);
      return fullServices;
    }
    return resp
  }

  // returns a full service object
  async function getFullServiceByCode(code) {
    var resp = await contract.methods["findServiceByCode"](code).call();
    return resp.events.ServiceIsRead.returnValues;
  }

  // creates new service
  async function createNewService(service) {
    console.log("Create new service:");
    console.log(
      parseInt(service.code),
      service.serviceType.toString(),
      service.serviceName.toString(),
      service.location.toString(),
      service.startdate.getTime(),
      service.enddate.getTime(),
      service.instructor.toString(),
      parseInt(service.costs)
    );
    const accounts = await web3.eth.getAccounts();
    console.log(accounts[0]);
    var resp =  await contract.methods.createService(
      2,
      service.serviceType.toString(),
      service.serviceName.toString(),
      service.location.toString(),
      1,
      1,
      service.instructor.toString(),
      1
    ).send({ from: accounts[0]});

    console.log(resp);
    updateData();
  }

  function updateData() {
    // This needs to update the list of services depending on the user role
    // if (serviceProviderRole){
    //   getMyCourcesCodes();
    // } else {
    //   emitAllServices();
    // }
  }

  // this should be called on edit
  async function editService(service) {
    var resp = await this.state.contract.methods["updateService"]({
      code: service.code,
      serviceType: service.serviceType,
      serviceName: service.serviceName,
      location: service.location,
      startdate: service.startdate,
      enddate: service.enddate,
      instructor: service.instructor,
      costs: service.cost
    }).call();
    updateData();
  }

  //deleting the service
  async function deleteService(service) {
    var resp = await this.state.contract.methods["deleteService"]({ code: service.code }).call();
    updateData();
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
    ],
    data: serviceData,  // I set this data above in component on mount, but it doesn't work
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


  return (
    <Fragment>
      <CssBaseline />
      <Container fixed>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Title title="Services" />
            <div className={classes.marginAutoContainer}>
              <div className={classes.marginAutoItem}>

                <MaterialTable
                  title="My Services"
                  columns={state.columns}
                  data={state.data}
                  editable={{
                    onRowAdd: newData =>
                      new Promise(resolve => {
                        setTimeout(() => {
                          resolve();
                          setState(prevState => {
                            const data = [...prevState.data];
                            data.push(newData);
                            createNewService(newData);
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
                              const data = [...prevState.data];
                              data[data.indexOf(oldData)] = newData;
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
                            const data = [...prevState.data];
                            data.splice(data.indexOf(oldData), 1);
                            return { ...prevState, data };
                          });
                        }, 600);
                      }),
                  }}
                />
                <Button variant="contained" color="primary" onClick={() => history.push("/register")}>
                  Servicies
                </Button>
              </div>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
}

export default Services;
