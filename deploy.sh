#!/bin/bash
s3cmd sync -P --no-progress dist/ s3://mockbrian.com/kaomoji/
