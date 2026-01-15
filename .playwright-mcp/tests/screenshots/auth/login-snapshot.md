### Page state
- Page URL: http://localhost:3000/login
- Page Title: Sign In | Tabatimer
- Page Snapshot:
```yaml
- generic [active] [ref=e1]:
  - generic [ref=e4]:
    - generic [ref=e5]:
      - generic [ref=e6]: Welcome back
      - generic [ref=e7]: Enter your credentials to access your account
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]:
          - text: Email
          - textbox "Email" [ref=e11]:
            - /placeholder: you@example.com
        - generic [ref=e12]:
          - text: Password
          - textbox "Password" [ref=e13]:
            - /placeholder: ••••••••
        - button "Sign in" [ref=e14]
      - generic [ref=e15]:
        - text: Don't have an account?
        - link "Sign up" [ref=e16] [cursor=pointer]:
          - /url: /signup
  - button "Open Next.js Dev Tools" [ref=e22] [cursor=pointer]:
    - img [ref=e23]
  - alert [ref=e26]
```
