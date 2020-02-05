   pragma solidity ^0.5.11;

   contract ServiceProvider {

      struct Service {
         uint code;
         address owner;
         string serviceType;
         string serviceName;
         string location;
         uint startdate;
         uint enddate;
         string instructor;
         uint256 costs;
      }

      mapping(address => Service[]) public serviseCreator;
      mapping(uint => Service) public serviceCode;
      mapping(uint => uint) public codeIndexAllServices;

      uint[] public allServices = [0];

      event ServiceIsCreated(uint code, string serviceName);
      event ServiceIsUpdated(uint code, string serviceName);
      event ServiceIsDeleted(uint code);
      event ServiceIsRead(uint code_,
         address owner,
         string serviceType,
         string serviceName,
         string location,
         uint startdate,
         uint enddate,
         string instructor,
         uint256 costs
      );
      event EmitServices(address owner, uint[]);

      uint totalServices = 0;

      modifier legalCode(uint code){
         require(code != 0, "Code 0 is not allowed.");
         require(codesEqual((serviceCode[code]).code, 0), "This code is already used.");
        _;
      }

      function createService(
         uint code,
         string memory serviceType,
         string memory serviceName,
         string memory location,
         uint startdate,
         uint enddate,
         string memory instructor,
         uint256 costs
      ) public legalCode(code) returns(bool){
         Service memory s = Service(code, msg.sender, serviceType, serviceName, location, startdate, enddate, instructor, costs);
         serviseCreator[msg.sender].push(s);
         serviceCode[code] = s;
         allServices.push(code);
         codeIndexAllServices[code] = (allServices.length - 1);
         totalServices++;
         emit ServiceIsCreated(code, serviceName);
         return true;
      }

      function updateService(
         uint code,
         string memory serviceType,
         string memory serviceName,
         string memory location,
         uint startdate,
         uint enddate,
         string memory instructor,
         uint256 costs
      ) public {
         Service memory s = Service(code, msg.sender, serviceType, serviceName, location, startdate, enddate, instructor, costs);
         serviseCreator[msg.sender].push(s);
         serviceCode[code] = s;
         for(uint256 i = 0; i < serviseCreator[msg.sender].length; i++){
            Service memory s = serviseCreator[msg.sender][i];
            if(codesEqual(code, s.code)){
               s.serviceType = serviceType;
               s.serviceName = serviceName;
               s.location = location;
               s.startdate = startdate;
               s.enddate = enddate;
               s.instructor = instructor;
               s.costs = costs;
               serviseCreator[msg.sender][i] = s;
               serviceCode[code] = s;
               emit ServiceIsUpdated(code, serviceName);
            }
         }
      }
// codeIndexAllServices
      function deleteService(uint code) public {
         require(totalServices > 0, 'No services are found');
         for(uint256 i = 0; i < serviseCreator[msg.sender].length; i++){
            if(codesEqual(code, serviseCreator[msg.sender][i].code)){
               serviseCreator[msg.sender][i] = serviseCreator[msg.sender][serviseCreator[msg.sender].length-1];
               delete serviseCreator[msg.sender][serviseCreator[msg.sender].length-1];
               if (serviceCode[code].owner == msg.sender){
                  delete serviceCode[code];
                  allServices[codeIndexAllServices[code]] = allServices[totalServices];
                  delete allServices[totalServices];
                  delete codeIndexAllServices[code];// avoid 0 index TODO
                  totalServices--;
                  emit ServiceIsDeleted(code);
               }
            }
         }
      }

      function findServiceByCode (uint code) public returns (
         uint code_,
         address owner,
         string memory serviceType,
         string memory serviceName,
         string memory location,
         uint startdate,
         uint enddate,
         string memory instructor,
         uint256 costs
      ) {
         Service memory s = serviceCode[code];
         // emit ServiceIsRead(
         //    s.code,
         //    s.owner,
         //    s.serviceType,
         //    s.serviceName,
         //    s.location,
         //    s.startdate,
         //    s.enddate,
         //    s.instructor,
         //    s.costs
         // );
         return (
            s.code,
            s.owner,
            s.serviceType,
            s.serviceName,
            s.location,
            s.startdate,
            s.enddate,
            s.instructor,
            s.costs
         );
      }

      function findServiceByName (string memory serviceName) public returns (
         uint code,
         address owner,
         string memory serviceType,
         string memory serviceName_,
         string memory location,
         uint startdate,
         uint enddate,
         string memory instructor,
         uint256 costs
      ) {
         for(uint256 i = 0; i < serviseCreator[msg.sender].length; i++){
            Service memory s = serviseCreator[msg.sender][i];
            if(nameEquals(serviceName, s.serviceName)){
               // emit ServiceIsRead(
               //    s.code,
               //    s.owner,
               //    s.serviceType,
               //    s.serviceName,
               //    s.location,
               //    s.startdate,
               //    s.enddate,
               //    s.instructor,
               //    s.costs
               // );
               return (
                  s.code,
                  s.owner,
                  s.serviceType,
                  s.serviceName,
                  s.location,
                  s.startdate,
                  s.enddate,
                  s.instructor,
                  s.costs
               );
            }
         }
         revert('Service is not found');
      }

      function emitServices() public view returns (uint[] memory){
         uint[] memory codes;
         for(uint256 i = 0; i < serviseCreator[msg.sender].length; i++){
            codes[i] = serviseCreator[msg.sender][i].code;
         }
         // emit EmitServices(msg.sender, codes);
         return codes;
      }

      function emitAllServices() public {
         emit EmitServices(msg.sender, allServices);
         // return allServices;
      }

      function codesEqual (uint a, uint b) internal pure returns (bool) {
         return a == b;
      }

      function nameEquals (string memory a, string memory b)  internal pure returns (bool){
         return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
      }

   }