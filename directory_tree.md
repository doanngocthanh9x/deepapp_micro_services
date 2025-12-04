📁 /workspaces/deepapp_micro_services

├── .gitignore
├── README.md
├── directory_tree.md
├── docker
│   ├── kafka
│   ├── nginxproxymanager
│   ├── php_admin_mysql
│   │   ├── .gitignore
│   │   └── docker-compose.yml
│   ├── pocketbase
│   └── redis
├── docs
│   └── DAY1.MD
├── scripts
│   └── nodetree.py
├── services
│   └── node-api-gateway
│       ├── .gitignore
│       ├── COMPLETED.md
│       ├── Dockerfile
│       ├── README.md
│       ├── check-port.sh
│       ├── cleanup.sh
│       ├── config
│       │   ├── database.js
│       │   └── swagger.js
│       ├── kill-all.sh
│       ├── kill-port.sh
│       ├── models
│       │   ├── Application.js
│       │   ├── ApplicationNote.js
│       │   ├── Candidate.js
│       │   ├── CandidateEducation.js
│       │   ├── CandidateExperience.js
│       │   ├── CandidateSkill.js
│       │   ├── Employer.js
│       │   ├── EmployerReview.js
│       │   ├── HrProfile.js
│       │   ├── InterviewSchedule.js
│       │   ├── Job.js
│       │   ├── JobAlert.js
│       │   ├── JobTag.js
│       │   ├── Message.js
│       │   ├── Notification.js
│       │   ├── Product.js
│       │   ├── SavedJob.js
│       │   ├── User.js
│       │   └── index.js
│       ├── package-lock.json
│       ├── package.json
│       ├── routes
│       │   ├── jobs.js
│       │   ├── products.js
│       │   └── users.js
│       ├── scripts
│       │   └── generate-models.js
│       ├── server.js
│       ├── start.sh
│       └── utils
│           └── generateSwaggerFromExpress.js
└── shared
    ├── database_ddl
    │   ├── mysql
    │   │   ├── init.sql
    │   │   └── script01.sql
    │   └── postgre
    │       └── script01.sql
    └── images
        └── logo
            └── deepapp.png
