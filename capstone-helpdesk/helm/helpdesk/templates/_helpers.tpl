{{- define "helpdesk.fullname" -}}
{{- .Chart.Name -}}
{{- end -}}

{{- define "helpdesk.labels" -}}
app.kubernetes.io/name: {{ .Chart.Name }}
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
