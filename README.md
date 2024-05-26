UberApp

⭐Overview
UberApp is a ride-hailing application where users can book rides and drivers can accept or reject ride requests.
The application includes features such as user and driver authentication, ride booking and cancellation,
OTP-based ride start, ride history, and vehicle type selection.

Features
 1.User and Driver
     Login and Signup:-
                 Both users and drivers can create accounts and log in to the application.
2.User Features
✔️ Book a Ride--
 * Users can book a ride by selecting a pickup and drop-off location.
 * Users can choose between different types of vehicles (Car or Bike).
   
✔️Cancel a Ride--
 *Users have the option to cancel a ride before it starts.
 
✔️Ride History
 * Users can view their ride history, including completed and canceled rides.
   
✔️Driver Features

2.Accept or Reject Ride Requests

 * Drivers can view incoming ride requests and choose to accept or reject them.
   
 ✔️ Start Ride with OTP--
 
 * After accepting a ride request, drivers can start the ride only after entering an OTP provided by the user.

 ✔️ Ride History--
 * Drivers can view their ride history, including completed and canceled rides.
  
3.Additional Features

✔️ Location API Integration
* The application uses a Location API to calculate distances and determine driver availability based on the user's location.


Workflow This App-:-
* User Registration and Login
* Users and drivers register and log in to the application.
  
  Ride Booking=>
*  The user selects a vehicle type (Car/Bike), pickup, and drop-off locations.
* The application checks for available drivers using the Location API.

 Ride Request =>
*A ride request is sent to nearby drivers.
* Drivers receive the request and choose to accept or reject it.

Ride Acceptance=>

* If a driver accepts the ride, the user receives a notification with the driver's details.
  
Ride Cancellation=>
* The user has the option to cancel the ride before it starts.

Start Ride with OTP=>

* Upon meeting, the user provides an OTP to the driver.
* The driver enters the OTP to start the ride.
 
Ride Completion=>
* The ride is completed and added to both user and driver's ride history
