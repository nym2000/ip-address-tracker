        var map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Blue marker
        var marker = null;

        // Handle search function to read IP input
        function handleSearch() {
            var ipValue = document.getElementById('ip-input').value.trim();
            document.getElementById('error-msg').style.display = 'none';
            if (ipValue === '') {
                showError();
                return;
            }
            lookupIP(ipValue);
        }

        // Also trigger search when the user presses Enter
        document.getElementById('ip-input').addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                handleSearch();
            }
        });

        var apiKey = 'at_qC1FolEpuYwmuscMwsOAKhx3I4I3v';

        function lookupIP(ip) {
            // Building URL
            var url = 'https://geo.ipify.org/api/v2/country,city?apiKey=' + apiKey;

            // Append IP to URL above
            // Autodetection of IP otherwise
            if (ip !== '') {
                var isDomain = isNaN(ip.replace(/\./g, ''));
                if (isDomain) {
                    url = url + '&domain=' + ip;
                } else {
                    url = url + '&ipAddress=' + ip;
                }
            }

            // Use full URL to receive data + process into JSON
            fetch(url)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    // Error handling if "messages" field is present
                    if (data.messages) {
                        showError();
                        return;
                    }

                    displayData(data);
                })
                .catch(function () {
                    showError();
                });
        }

        // Adding data to info blocks
        function displayData(data) {
            document.getElementById('display-ip').textContent = data.ip;
            document.getElementById('display-location').textContent =
                data.location.city + ', ' + data.location.region + ' ' + data.location.postalCode;
            document.getElementById('display-timezone').textContent = 'UTC ' + data.location.timezone;
            document.getElementById('display-isp').textContent = data.isp;

            // Update map with new coordinates
            var lat = data.location.lat;
            var lng = data.location.lng;
            map.setView([lat, lng], 13);
            marker = L.marker([lat, lng]).addTo(map);
        }

        function showError() {
            document.getElementById('error-msg').style.display = 'block';
        }

        // On page load, show user's own IP
        lookupIP('');