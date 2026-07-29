import random
from locust import HttpUser, task, between


class WebsiteUser(HttpUser):
    host = "http://127.0.0.1:8000"
    wait_time = between(1, 3)

    @task
    def browse_site(self):
        # Home page - random trek pages
        page = random.randint(1, 10)
        self.client.get(f"/api/treks/?page={page}")

        # User browses another page
        page = random.randint(1, 10)
        self.client.get(f"/api/treks/?page={page}")

        # Search suggestions
        self.client.get("/api/treks/search/?q=coorg")

        # Blogs
        self.client.get("/api/blogs/")

        # Travel Your Way
        self.client.get("/api/travel-your-way/")