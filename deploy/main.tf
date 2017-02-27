# Specify the provider and access details
provider "aws" {
   region = "${var.aws_region}"
}

# Create a VPC to launch our instances into
resource "aws_vpc" "default" {
  cidr_block = "10.0.0.0/16"
}

# Create an internet gateway to give our subnet access to the outside world
resource "aws_internet_gateway" "default" {
  vpc_id = "${aws_vpc.default.id}"
}

# Grant the VPC internet access on its main route table
resource "aws_route" "internet_access" {
  route_table_id         = "${aws_vpc.default.main_route_table_id}"
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = "${aws_internet_gateway.default.id}"
}

# Create a subnet to launch our instances into
resource "aws_subnet" "default" {
  vpc_id                  = "${aws_vpc.default.id}"
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
}

# A security group for the ELB so it is accessible via the web
resource "aws_security_group" "elb" {
  name        = "fake-expat-claim-service-elb"
  description = "Used in the fake-expat-claim-service"
  vpc_id      = "${aws_vpc.default.id}"

  # HTTP access from anywhere
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Our default security group to access
# the instances over SSH and HTTP
resource "aws_security_group" "default" {
  name        = "fake-expat-claim-service"
  description = "Used in the fake-expat-claim-service"
  vpc_id      = "${aws_vpc.default.id}"

  # SSH access from anywhere
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTP access from the VPC
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_elb" "web" {
  name = "fake-expat-claim-service-elb"

  subnets         = ["${aws_subnet.default.id}"]
  security_groups = ["${aws_security_group.elb.id}"]
  instances       = ["${aws_instance.web.id}"]

  listener {
    instance_port     = 80
    instance_protocol = "http"
    lb_port           = 80
    lb_protocol       = "http"
  }
  health_check {
    healthy_threshold = 2
    unhealthy_threshold = 2
    timeout = 3
    target = "HTTP:80/meta/health"
    interval = 30
  }
}

resource "aws_key_pair" "auth" {
  key_name   = "${var.key_name}"
  public_key = "${file(var.public_key_path)}"
}

resource "aws_instance" "web" {
  # The connection block tells our provisioner how to
  # communicate with the resource (instance)
  connection {
    # The default username for our AMI
    user = "ubuntu"

    # The connection will use the local SSH agent for authentication.
  }

  instance_type = "t2.micro"

  # Lookup the correct AMI based on the region
  # we specified
  # ami = "${lookup(var.aws_amis, var.aws_region)}"
  ami = "${var.aws_ami}"

  # The name of our SSH keypair we created above.
  key_name = "${aws_key_pair.auth.id}"

  # Our Security group to allow HTTP and SSH access
  vpc_security_group_ids = ["${aws_security_group.default.id}"]

  # We're going to launch into the same subnet as our ELB. In a production
  # environment it's more common to have a separate private subnet for
  # backend instances.
  subnet_id = "${aws_subnet.default.id}"
}

resource "aws_security_group" "postgres" {
  name        = "postgres.fake-expat-claim-service"
  description = "Used in the postgres.fake-expat-claim-service"
  vpc_id      = "${aws_vpc.default.id}"

  # HTTP access from the VPC
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  # outbound internet access
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "default" {
  allocated_storage    = 10
  engine               = "mysql"
  engine_version       = "5.6.17"
  instance_class       = "db.t2.micro"
  name                 = "mydb"
  username             = ""
  password             = "testing"
  parameter_group_name = "default.mysql5.6"
  vpc_security_group_ids = ["${aws_security_gruop.postgres.id}"]
}

##  resource "aws_volume_attachment" "postgres_volume_attachment_config" {
##    device_name = "/etc/postgresql"
##    volume_id = "${aws_ebs_volume.postgres_volume_config.id}"
##    instance_id = "${aws_instance.postgres.id}"
##  }

##  resource "aws_volume_attachment" "postgres_volume_attachment_log" {
##    device_name = "/var/log/postgresql"
##    volume_id = "${aws_ebs_volume.postgres_volume_logs.id}"
##    instance_id = "${aws_instance.postgres.id}"
##  }

##  resource "aws_volume_attachment" "postgres_volume_attachment_database" {
##    device_name = "/var/log/postgresql"
##    volume_id = "${aws_ebs_volume.postgres_volume_database.id}"
##    instance_id = "${aws_instance.postgres.id}"
##  }

##  resource "aws_instance" "postgres" {
##    ami = "ami-405f7226"
##    instance_type = "t2.micro"
##    tags {
##      Name = "postgres.fake-expat-claim-service"
##    }
##    # Our Security group to allow HTTP and SSH access
##    vpc_security_group_ids = ["${aws_security_group.postgres.id}"]

##    # We're going to launch into the same subnet as our ELB. In a production
##    # environment it's more common to have a separate private subnet for
##    # backend instances.
##    subnet_id = "${aws_subnet.default.id}"
##  }

##  resource "aws_ebs_volume" "postgres_volume_config" {
##    availability_zone = "${var.aws_region}a"
##    size = 1
##    tags {
##      Name = "config.postgres.fake-expat-claim-service"
##    }
##  }

##  resource "aws_ebs_volume" "postgres_volume_logs" {
##    availability_zone = "${var.aws_region}a"
##    size = 1
##    tags {
##      Name = "logs.postgres.fake-expat-claim-service"
##    }
##  }

##  resource "aws_ebs_volume" "postgres_volume_database" {
##    availability_zone = "${var.aws_region}a"
##    size = 1
##    tags {
##      Name = "database.postgres.fake-expat-claim-service"
##    }
##  }
