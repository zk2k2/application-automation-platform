import json
import urllib.parse
import urllib.request

def lambda_handler(event, context):
    params = event.get('queryStringParameters') or {}
    long_url = params.get('long_url')

    if not long_url:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': "Missing 'long_url' query parameter"})
        }

    encoded_url = urllib.parse.quote(long_url, safe='')
    api_url = f"https://is.gd/create.php?format=simple&url={encoded_url}"

    headers = {
        'User-Agent': 'Mozilla/5.0 (compatible; AWS Lambda URL shortener)'
    }

    req = urllib.request.Request(api_url, headers=headers)

    try:
        with urllib.request.urlopen(req) as response:
            short_url = response.read().decode('utf-8')

        return {
            'statusCode': 200,
            'body': json.dumps({'short_url': short_url}),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
