document.addEventListener("DOMContentLoaded", function(){
    function raiseError(err) {
        document.getElementById('login-error').innerHTML=`
        <div class="alert alert-danger" role="alert">
        ${err}
        </div>
        `
    }
    function processForm(e) {
        if (e.preventDefault) e.preventDefault();
        let fd = new FormData(e.target)
        
        fetch("/api/v1/users/authenticate", {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify({
                "email": fd.get("username"),
                "password": fd.get("password")
            })
        })
        .then(response => {
            if (response.status == 401) {
                raiseError("Bad Username or Password");
                return null;
            } else {
                return response.json()
            }
        })
        .then((authData) => {
            if (authData != null) {
                localStorage.setItem('BMS-Auth', authData["token"]);
                window.location.href = '/';
            }
        })
        .catch(err => {
            console.error(err);
        });
        
        
        // You must return false to prevent the default form behavior
        return false;
    }

    let form = document.getElementById("login");
    if (form.attachEvent) {
        form.attachEvent("submit", processForm);
    } else {
        form.addEventListener("submit", processForm);
    }
});
