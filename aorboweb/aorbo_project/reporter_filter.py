import traceback
from django.utils import timezone
from django.views.debug import SafeExceptionReporterFilter, ExceptionReporter


class MinimalExceptionReporterFilter(SafeExceptionReporterFilter):
    def get_safe_request_meta(self, request):
        keep = ('REQUEST_METHOD', 'PATH_INFO', 'REMOTE_ADDR', 'HTTP_USER_AGENT')
        return {k: v for k, v in request.META.items() if k in keep}

    def get_safe_settings(self):
        return {}


class MinimalExceptionReporter(ExceptionReporter):
    def get_traceback_text(self):
        c = self.get_traceback_data()
        request = self.request
        lines = []

        path = request.path if request else ""
        exc_type = c.get('exception_type')
        exc_value = c.get('exception_value')

        lines.append(f"Internal Server Error: {path}")
        lines.append("")
        lines.append(f"{exc_type} at {path}")
        lines.append(f"{exc_value}")
        lines.append("")
        if request:
            lines.append(f"Request Method: {request.META.get('REQUEST_METHOD')}")
            lines.append(f"Request URL: {request.build_absolute_uri()}")
        lines.append(f"Django Version: {c.get('django_version_info')}")
        lines.append(f"Server time: {timezone.localtime(c.get('server_time')).strftime('%a, %d %b %Y %H:%M:%S %z')}")
        lines.append("")

        if self.exc_type and self.exc_value and self.tb:
            formatted = traceback.format_exception(self.exc_type, self.exc_value, self.tb)
            lines.append("".join(formatted))

        lines.append(f"Exception Type: {exc_type} at {path}")
        lines.append(f"Exception Value: {exc_value}")
        if c.get('raising_view_name'):
            lines.append(f"Raised during: {c.get('raising_view_name')}")
        lines.append("Request information:")
        lines.append(f"USER: {c.get('user_str')}")
        lines.append("")

        get_items = list(c.get('request_GET_items', []))
        lines.append("GET: " + (", ".join(f"{k}={v}" for k, v in get_items) if get_items else "No GET data"))
        lines.append("")

        post_items = list(c.get('filtered_POST_items', []))
        lines.append("POST: " + (", ".join(f"{k}={v}" for k, v in post_items) if post_items else "No POST data"))
        lines.append("")

        files_items = list(c.get('request_FILES_items', []))
        lines.append("FILES: " + (", ".join(f"{k}={v}" for k, v in files_items) if files_items else "No FILES data"))
        lines.append("")

        lines.append("META:")
        for key, value in c.get('request_meta', {}).items():
            lines.append(f"{key} = {value!r}")

        return "\n".join(lines)