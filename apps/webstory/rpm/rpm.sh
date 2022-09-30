#!/bin/bash

ZIP_NAME="webstory-frontend"
NAME="${ZIP_NAME}"
VERSION=${2}
RELEASE=${3}
VENDOR="AFP"
EMAIL="Nicolas Roudaire <nicolas.roudaire@afp.com>"
SUMMARY="Webstory frontend"
LICENSE="AFP"
GROUP="AFP/Iris/Webstory"
ARCH="noarch"
DESCRIPTION="Webstory frontend"

INSTALL_DIR="\/home\/iris-sr-wm\/java\/tomcat\/webapps\/webstory\/"
NOW=$(echo `LC_ALL="C" date +"%a %b %d %Y"`)

FILES=$(unzip -Z1 $1 | grep -v '^.*/$' | sed "s/^/${INSTALL_DIR}/")
DIRS=$(unzip -Z1 $1 | grep '^.*/$' | sed "s/^/%dir ${INSTALL_DIR}/")
OWNER="iriswmadm"
GROUP="iris"

cat << EOF
%define _unpackaged_files_terminate_build 0
%define _binaries_in_noarch_packages_terminate_build 0
%define _binary_filedigest_algorithm 1
%define _binary_payload 1
%define _invalid_encoding_terminates_build 0

%define iris_group iris
%define iris_gid 500
%define irisadm  irisadm
%define irisadm_uid 510

%define iris_user iriswmadm
%define iris_user_uid 573


%define app_user $OWNER
%define app_group $GROUP


%define env_file /usr/local/etc/iris/afp-env


%define zip_name $ZIP_NAME
%define install_dir /home/iris-sr-wm/java/tomcat/webapps/webstory
%define install_dir_first_directory /home/iris-sr-wm/
%define _rpmdir $RPM_DIR

Name: $NAME
Version: $VERSION
Release: $RELEASE%{?dist}
Vendor: $VENDOR
Summary: $SUMMARY
License: $LICENSE
Group: $GROUP
Source0: $ZIP_NAME.zip

BuildArch: $ARCH

Requires: unzip

%description
$DESCRIPTION

%pre
echo -e "\n[INFO] Installing %{name}-%{version}-%{release}"

# user of this service creation
# -------------------------------------------
echo -e "\n[INFO] Check if %{iris_group} group exists"
getent group %{iris_group} >/dev/null || \
  groupadd -g %{iris_gid} %{iris_group}

# user of this service creation
# -------------------------------------------
echo -e "\n[INFO] Check if %{iris_user} user exists"
getent passwd %{iris_user} >/dev/null || \
  useradd -g %{iris_group} -d /home/%{iris_user} -u %{iris_user_uid} -s /bin/bash -c "iris user for %{name}" %{iris_user}


%build

%install
mkdir -p %{buildroot}%{install_dir}
install -p -v -m 755 %{SOURCE0} %{buildroot}%{install_dir}
unzip %{buildroot}%{install_dir}/%{zip_name}.zip -d %{buildroot}%{install_dir}

%post

chown -R %{app_user}:%{app_group} %{install_dir_first_directory}
chmod -R 755 %{install_dir_first_directory}
chown -R %{app_user}:%{app_group} %{install_dir}
find %{install_dir} -type f -exec chmod 644 {} \;
%clean
rm -fr %{buildroot}


%files
%defattr(-,root,root)
$FILES
$DIRS
%{install_dir}/%{zip_name}.zip

%changelog

* $NOW $EMAIL $VERSION-$RELEASE
- first Version

EOF
