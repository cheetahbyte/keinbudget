import subprocess

def get_version():
    return subprocess.check_output(
        ["git", "describe", "--tags", "--always", "--dirty"]
    ).decode("utf-8").strip()

with open("./server/version.txt", "w") as f:
    f.write(get_version())