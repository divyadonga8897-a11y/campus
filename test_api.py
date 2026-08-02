import urllib.request
import json

endpoints = [
    "/",
    "/api/v1/college",
    "/api/v1/departments",
    "/api/v1/departments/cse",
    "/api/v1/courses",
    "/api/v1/courses/b-tech-cse",
    "/api/v1/fees",
    "/api/v1/scholarships",
    "/api/v1/campus/facilities",
    "/api/v1/campus/gallery",
    "/api/v1/campus/campus-locations",
    "/api/v1/placements",
    "/api/v1/recruiters",
    "/api/v1/internships",
    "/api/v1/alumni",
    "/api/v1/testimonials"
]

print("=== STARTING BACKEND API VERIFICATION ===")
for ep in endpoints:
    url = f"http://127.0.0.1:8000{ep}"
    try:
        response = urllib.request.urlopen(url)
        data = json.loads(response.read().decode())
        print(f"[OK] GET {ep} - SUCCESS")
        if ep == "/api/v1/college":
            print(f"  College Name: {data['data']['name']}")
        elif ep == "/api/v1/departments":
            print(f"  Departments Found: {len(data['data'])}")
        elif ep == "/api/v1/campus/facilities":
            print(f"  Facilities Found: {len(data['data'])}")
        elif ep == "/api/v1/campus/gallery":
            print(f"  Gallery Items Found: {len(data['data'])}")
        elif ep == "/api/v1/campus/campus-locations":
            print(f"  Campus Locations Found: {len(data['data'])}")
        elif ep == "/api/v1/placements":
            print(f"  Placement Stats Records Found: {len(data['data'])}")
        elif ep == "/api/v1/recruiters":
            print(f"  Recruiters Found: {len(data['data'])}")
        elif ep == "/api/v1/internships":
            print(f"  Internships Found: {len(data['data'])}")
        elif ep == "/api/v1/alumni":
            print(f"  Alumni Found: {len(data['data'])}")
        elif ep == "/api/v1/testimonials":
            print(f"  Testimonials Found: {len(data['data'])}")
    except Exception as e:
        print(f"[FAIL] GET {ep} - FAILED: {str(e)}")

print("=== API VERIFICATION COMPLETED ===")
