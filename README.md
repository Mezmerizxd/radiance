# Project Documentation

### Project Scope

- [User Registration and Profiles](./docs/ProjectScope/USER_REGISTRATION_PROFILES.md)
- [Booking System](./docs/ProjectScope/BOOKING_SYSTEM.md)
- [Messaging and Communication](./docs/ProjectScope/MESSAGING_COMMUNICATION.md)
- [Payment Processing](./docs/ProjectScope/PAYMENT_PROCESSING.md)
- [Service History and Reviews](./docs/ProjectScope/SERVICE_HISTORY_REVIEWS.md)
- [Financial Management](./docs/ProjectScope/FINANCIAL_MANAGEMENT.md)
- [Admin Panel](./docs/ProjectScope/ADMIN_PANEL.md)

### Project Design

- [Client Review](./docs/CLIENT_OPINIONS.md)
- [Alternative Design](./docs/ALTERNATIVE_DESIGN.md)

### Features (Soon Each Feature Will Have Its Own Page With More Details)

- Account & Profile System
  - [x] [Login & Register](./docs/Features/LOGIN_REGISTER.md)
  - [x] Edit Profile
  - [x] Create Address
  - [ ] Edit Address
  - [x] Token Authentication w/ 24hrs Expiry
  - [x] Encrypted Passwords
  - [ ] Change Password
  - [ ] Email Verification
  - [ ] 2 Factor Authentication
  - [ ] Forgot Password
  - [ ] Delete Account
- Booking System
  - [x] Create Booking
  - [x] Edit Booking
  - [x] Cancel Booking
  - [x] View Bookings (Calendar)
  - [x] View Bookings (List)
  - [ ] Reschedule Booking
  - [ ] Booking Email Notifications
- Payment System <span style="color:orange">(Testing)</span>.
  - [x] Create Payment Intent
  - [x] Confirm Payment Intent
  - [ ] Cancel Payment Intent
  - [ ] View Payment History
  - [ ] View Payment Details
  - [ ] View Payment Receipt
  - [ ] Payment Email Notifications

### Estimated Timelines

Desired timelines that I would like to achieve, but not guaranteed.
At the moment I'm averaging 1 - 2 hours per day, so I'm not sure if I can achieve these timelines.

- 6 - 8 Hours / Day, £13 / Hour [View](./docs/images/TIMELINE_01.png)
- 3 - 5 Hours / Day, £13 / Hour [View](./docs/images/TIMELINE_02.png)

### Platforms

- Web Browser
  - Easiest to develop for and most accessible.
  - Can be used on any device with a web browser.
- Android & IOS
  - Designing for mobile is a little more difficult.
  - Expensive to publish on the app store.
  - Requires a lot of testing on different devices.
- Desktop
  - All it takes is a few lines of code to make the app work on desktop.
  - Downside is that its memory intensive and requires a lot of storage.

### How the App Works

- The app is called Zvyezda, and it is a web application that helps cleaners find and manage their jobs.
- The app has four main parts: `Engine`, `Radiance`, `Server`, and `Web`.
  - `Engine` is the core of the app, it handles the logic and data of the app. It is written in Go, which is a programming language that is fast and reliable.
  - `Radiance` is the front-end of the app, it is what the cleaners see and interact with on their browsers. It is written in TypeScript and React, which are programming languages that are popular and easy to use for web development.
  - `Server` is another part of the app that connects `Engine` and `Radiance`. It is also written in TypeScript, but it runs on Node.js, which is a platform that allows JavaScript code to run on the server side.
  - `Web` is my personal website, where I showcase my skills and projects. It is also written in TypeScript and React, and it uses `Server` as its backend.
- The app runs on a small computer that I have at home, which has Ubuntu 20.04 LTS as its operating system. Ubuntu is a type of Linux, which is a free and open source operating system that is widely used by developers.
- The app uses a program called `pm2` to manage its processes. `pm2` makes sure that the app runs smoothly and restarts automatically if there are any errors or updates.
- The app also uses a program called `nginx` to handle the web traffic. `nginx` is a web server that redirects the requests from the internet to the app.
- The app has a domain name called `zvyezda.com`, which is what people type in their browsers to access the app. I use `NameCheap` to register and manage my domain name, and I use their DNS servers to point `zvyezda.com` to my computer’s IP address.

### Development Operations

1. When I want to make changes to the app, I create a new branch on GitHub, which is a platform that hosts and manages my code online.
2. I write and test my code on the new branch, making sure that it works as expected and does not break anything else.
3. When I am happy with my code, I merge the new branch into the `main` branch, which is the branch that contains the latest version of the app.
4. I run a script called `start_zvyezda.sh` on my computer, which updates and restarts the app using pm2.
5. The script does the following steps:

- It goes to the folder where the app code is stored (`zvyezda/`).
- It stops and deletes the app process if it exists (`pm2 stop yarn` and `pm2 delete yarn`).
- It pulls the latest code from GitHub (`git pull`).
- It installs any new dependencies that the app needs (`yarn install`).
- It starts the app using another script called `start:prod`, which does three things:
  - It updates the database schema using a tool called `prisma` (`prisma migrate deploy`).
  - It builds the source files into executable files using a tool called `yarn` (`yarn build`).
  - It starts the app using `yarn` again (`yarn start`).

```bash
# start_zvyezda.sh

# Navigate to the directory
cd zvyezda/

# Stop the app if it's running
pm2 stop yarn || true

# Delete the app if it exists
pm2 delete yarn || true

# Pull the latest changes from git
git pull

# Install any new dependencies
yarn install

# Start the app
pm2 start yarn --name "yarn" -- start:prod
```

### Client Development

[API Management](./docs/API.md)

### Descriptions / Mottos / About

#### Descriptions

- Radiance is your go-to solution for home cleaning management. It seamlessly connects you with professional house cleaners in your area, allowing you to schedule, manage, and pay for house cleaning services with ease. With Radiance, maintaining a clean and healthy home is just a few taps away.
- Radiance is your digital concierge for home cleaning services. With a few taps, you can schedule, manage, and pay for professional cleaning services tailored to your needs.
- Radiance is the ultimate home cleaning management app. It offers a hassle-free way to connect with local cleaning professionals and manage your home cleaning schedule.
- Radiance is revolutionizing home cleaning with its intuitive app that brings professional cleaning services right to your doorstep.
- Radiance is your personal assistant for maintaining a clean home. It connects you with top-notch cleaning professionals in your area and allows you to manage all your cleaning needs in one place.
- Radiance is the smart way to keep your home clean. Our app connects you with local professional cleaners and provides a seamless platform to manage and pay for their services.

#### Motto's

- "Radiance - Your Beacon of Cleanliness!"
- “Radiance - Sparkling Homes at Your Fingertips!”
- “Radiance - Your Home’s Best Friend!”
- “Radiance - Clean Homes, Clear Minds!”
- “Radiance - Simplifying Home Cleaning!”
- “Radiance - A Cleaner Home is Just a Tap Away!”

[Homepage](../../README.md)
