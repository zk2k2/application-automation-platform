
<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<a id="readme-top"></a>

# Sendit, The Resume Delivery Platform!

<div align="center" style="background-color: red; padding: 1rem; display: inline-block; border-radius: 8px;">
  <br>
  <img src="https://github.com/user-attachments/assets/bb900689-4e31-4e61-a91e-d6a4159785f6" alt="sendit-logo" width="400">
  <br><br>
</div>

Sendit is a Next.js-based platform that streamlines the job application process by integrating a LaTeX CV editor, automated resume generation, and intelligent resume delivery.

## Demo 🎥

https://github.com/user-attachments/assets/1e316023-1e53-407a-8306-742b86fe2e47

## ✨ Features

* **Integrated LaTeX CV Editor**: Modify your resume directly from a private GitHub repo.
* **Secure Sharing**: Generate short, shareable URLs for your compiled PDF resumes.
* **CI/CD Workflow**: Automatically commit changes to a private repo, triggering a GitHub Actions workflow.
* **Cloud-Native Pipeline**:

  * Self-hosted EC2 GitHub runner compiles LaTeX in Docker.
  * Uploads PDF to S3 and metadata to DynamoDB.
  * Lambda function shortens the URL and stores final mapping.
* **Resume Management**: View and select saved resumes from your dashboard.
* **One-Click Apply**: Automatically generates and sends emails with the selected resume and metadata.

## 🧱 Architecture
The architecture of Sendit integrates Next.js, GitHub, Docker, AWS services, and Lambda functions to deliver a seamless CV management and application workflow.
<div align="center">
  <br>
  <img src="https://github.com/user-attachments/assets/e59b97bc-2870-4d9d-8c1a-f18fab0abeef" alt="sendit-architecture">
  <br><br>
</div>


## 🚀 Getting Started

### ✅ Prerequisites

Ensure you have the following installed:

* Node.js & npm
* AWS CLI configured with necessary permissions
* A GitHub account with a private repo containing LaTeX resume template

### 💻 Frontend Setup

1. **Clone the repo and navigate to the project:**

   ```sh
   git clone https://github.com/zk2k2/application-automation-platform.git
   cd apps/web
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the development server:**

   ```sh
   npm run dev
   ```

### ⚙️ Backend Workflow (GitHub Actions + AWS)

1. **Set up a private GitHub repository to store LaTeX CVs.**
   
3. **Configure an AWS account with a role and a policy.**
   
4. **Deploy a self-hosted EC2 runner and ensure it has:**
   * Docker
   * A working LaTeX Docker image
     
5. **Set up an S3 bucket and a DynamoDB table**
   
6. **Set up a Lambda Function:**
   * You can find the lambda code inside the src directory
     
7. **Set up the .env and .env.local:**
   You can find examples of the two files at the root of the Next.js app
     
8. **Setup the workflow at ./.github/main.yml in your resume's repo:**
   This will allow the workflow to run on your resume's repo
  
9. **Ready to go! You can automate your way to career stardom 😎**
 
     
## 🤝 Contributing

We welcome contributions to improve Sendit! Fork the repository and submit pull requests for review.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For more information, please contact me via email or connect on LinkedIn.

<!-- MARKDOWN LINKS & IMAGES -->

[contributors-shield]: https://img.shields.io/github/contributors/zk2k2/application-automation-platform.svg?style=for-the-badge
[contributors-url]: https://github.com/zk2k2/application-automation-platform/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/zk2k2/application-automation-platform.svg?style=for-the-badge
[forks-url]: https://github.com/zk2k2/application-automation-platform/network/members
[stars-shield]: https://img.shields.io/github/stars/zk2k2/application-automation-platform.svg?style=for-the-badge
[stars-url]: https://github.com/zk2k2/application-automation-platform/stargazers
[issues-shield]: https://img.shields.io/github/issues/zk2k2/application-automation-platform.svg?style=for-the-badge
[issues-url]: https://github.com/zk2k2/application-automation-platform/issues
[license-shield]: https://img.shields.io/github/license/zk2k2/application-automation-platform.svg?style=for-the-badge
[license-url]: https://github.com/zk2k2/application-automation-platform/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/your-linkedin-username

---
