<?php
$file = $_FILES['song']['tmp_name'];
echo file_get_contents($file);