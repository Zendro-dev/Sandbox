#!/bin/bash

# -------------------------------------------------------------------------------------
# upload_kobo_images.sh
#
# Uploads images from a KoBo-generated multimedia export directory.
#
# Usage: ./upload-kobo-images.sh dir|zip
#

NUM_ARGS=$#
TOTAL_FILES_PROCESSED=0
TOTAL_FILES_EXCLUDED=0
TOTAL_IMAGES_PROCESSED=0
TOTAL_IMAGES_OKS=0
TOTAL_IMAGES_ERRORS=0
CRIT_ERROR=0
LOG_FILE='./upload.log'

RED='\033[0;31m'
LGREEN='\033[1;32m'
YEL='\033[1;33m'
LGRAY='\033[38;5;242m'
NC='\033[0m'
MULTIMEDIA_DIR=''

#
# Function: summary()
#
# Print summary.
#
summary() {
  # Msg
  echo -e "\n${LGRAY}@@ ----------------------------${NC}"

  echo -e "${NC}@@ Total files processed: $TOTAL_FILES_PROCESSED"
  
  if [ $TOTAL_FILES_EXCLUDED -gt 0 ]; then
    echo -e "${NC}@@ Total files excluded: ${YEL}$TOTAL_FILES_EXCLUDED"
  else
    echo -e "${NC}@@ Total files excluded: ${LGREEN}$TOTAL_FILES_EXCLUDED"
  fi

  if [ $TOTAL_IMAGES_PROCESSED -gt 0 ]; then
    echo -e "${NC}@@ Total images processed: $TOTAL_IMAGES_PROCESSED"
  else
    echo -e "${NC}@@ Total images processed: ${RED}$TOTAL_IMAGES_PROCESSED"
  fi

  if [ $TOTAL_IMAGES_OKS -gt 0 ]; then
    echo -e "${NC}@@ Total images uploaded ok: ${LGREEN}$TOTAL_IMAGES_OKS"
  else
    echo -e "${NC}@@ Total images uploaded ok: $TOTAL_IMAGES_OKS"
  fi

  if [ $TOTAL_IMAGES_ERRORS -gt 0 ]; then
    echo -e "${NC}@@ Total images with errors: ${RED}$TOTAL_IMAGES_ERRORS"
  else
    echo -e "${NC}@@ Total images with errors: $TOTAL_IMAGES_ERRORS"
  fi

  # Msg
  if [ $CRIT_ERROR -gt 0 ] || [ $TOTAL_IMAGES_ERRORS -gt 0 ]; then
    echo -e "${NC}@@ ${RED}done${NC}"
  else
    echo -e "${NC}@@ ${LGREEN}done${NC}"
  fi
  echo -e "${LGRAY}---------------------------- @@${NC}\n"
}

#
# Checks
#
# check: Input argument
if [ $# -eq 0 ]; then
  # Msg
  echo -e "${RED}@@ No arguments supplied: ${NC}please provide the directory path where unziped KoBo multimedia-export directory is, or the path to the KoBo multimedia-export zip file.${NC}"
  exit 1
else
  # check: file exists
  if ls $1 &> /dev/null; then
    # case: zip
    if file --mime-type -b $1 | grep -qi 'zip'; then
      # Msg
      echo -e "\n${LGRAY}@@ ----------------------------${NC}"
      echo -e "${NC}@@ Zip file provided: starting unzip...${LGRAY}"

      # unzip
      if unzip -n $1 -d "$1.unziped"; then
        # Msg
        echo -e "Unziped directory: $1.unziped"
        echo -e "${NC}@@ Unzip... ${LGREEN}done${NC}"

        MULTIMEDIA_DIR=$1'.unziped'
      else
        # Msg
        echo -e "${RED}@@ Unzip file ${LGRAY}$1: ${NC}Failed."
        exit 1
      fi
    #case: directory
    elif [ -d $1 ]; then
      # Msg
      echo -e "\n${LGRAY}@@ ----------------------------${NC}"
      echo -e "${NC}@@ Directory provided"
      
      MULTIMEDIA_DIR=$1
    else
      # Msg
      echo -e "${RED}@@ Argument supplied is not ZIP or Directory: ${NC}please provide the directory path where unziped KoBo multimedia-export directory is, or the path to the KoBo multimedia-export zip file.${NC}"
      exit 1
    fi
  else
    # Msg
    echo -e "${RED}@@ Cannot access ${LGRAY}'$1': ${NC}No such file or directory."
    exit 1
  fi
fi

# Msg
echo -e "${LGRAY}@@${NC}"
echo -e "${LGRAY}@@ Start processing directory: ${LGRAY}$MULTIMEDIA_DIR${NC}"

#
# Upload images to GraphQL Server
#
while read f; 
do
  # count
  let "TOTAL_FILES_PROCESSED++"

  if file --mime-type -b "$f" | grep -iq 'image'; then
    # count
    let "TOTAL_IMAGES_PROCESSED++"
    # Msg
    echo -e "${NC}@@ Uploading image #${TOTAL_IMAGES_PROCESSED}: ${LGRAY}${f}"

    # upload image to graphql server
    o=$(curl -F attachment=@"$f" \
      -H "Authorization: Bearer `cat ./zendroImagesToken.tmp`" \
      -F query='
      mutation M {
        addImageAttachment( licence: "--", description: "'"${f}"'") {
          fileName fileSizeKb fileType fileUrl licence description smallTnUrl mediumTnUrl
        }}' 'http://localhost:3000/graphql');
    
    # check curl status
    if [ $? -ne 0 ]; then
      # Msg
      echo -e "${RED}@@ Error on curl command"

      # count
      let "CRIT_ERROR++"
      # print summary
      summary
      
      exit 1
    fi

    # check response error status
    status=$(echo $o | jq -r '.status')
    if [ "$status" != "null" ]; then
      echo $o | jq -r '.'
      echo $o | jq -r '.' >> ${LOG_FILE}
      # Msg
      echo -e "${RED}@@ Error on response from server"
      # count
      let "CRIT_ERROR++"
      # print summary
      summary
      
      exit 1
    fi

    # check graphql errors
    gql_errors=$(echo $o | jq -r '.errors')
    if [ "$gql_errors" != "null" ]; then
      echo $o | jq -r '.'
      echo $o | jq -r '.' >> ${LOG_FILE}
      # Msg
      echo -e "${RED}@@ GraphQL response with errors"
      # count
      let "TOTAL_IMAGES_ERRORS++"
    else
      # check data
      data=$(echo $o | jq -r '.data')
      if [ "$data" = "null" ]; then
        echo $o | jq -r '.'
        echo $o | jq -r '.' >> ${LOG_FILE}
        # Msg
        echo -e "${RED}@@ GraphQL response with no data"
        # count
        let "TOTAL_IMAGES_ERRORS++"
      else
        #
        # Image uploaded ok
        #
        echo $o | jq -r '.'
        echo $o | jq -r '.' >> ${LOG_FILE}
        # Msg
        echo -e "${NC}@@ Image uploaded ... ${LGREEN}ok${NC}\n"
        # count
        let "TOTAL_IMAGES_OKS++"
      fi
    fi
  else
    # count
    let "TOTAL_FILES_EXCLUDED++"
    # Msg
    echo -e "${LGRAY}@@ Not image file: ${f} ...${YEL} excluded${NC}"
  fi
done < <(find $MULTIMEDIA_DIR -type f)

# print summary
summary

# Done