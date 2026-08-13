WITH source_panes AS (
  SELECT
    settings.id,
    settings.user_id,
    settings.updated_at,
    pane.value AS pane_json,
    (
      SELECT json_group_array(json(source.value))
      FROM json_each(json_extract(pane.value, '$.sources')) AS source
      WHERE (
        json_extract(source.value, '$.type') = 'Study'
        OR json_extract(source.value, '$.type') LIKE 'study_%'
      )
      AND COALESCE(json_extract(source.value, '$.id'), '') NOT IN ('Bar Count@tv-basicstudies-1', 'Bar Count')
      AND COALESCE(json_extract(source.value, '$.name'), '') <> 'Bar Count'
      AND COALESCE(json_extract(source.value, '$.metaInfo.id'), '') NOT IN ('Bar Count@tv-basicstudies-1', 'Bar Count')
      AND COALESCE(json_extract(source.value, '$.metaInfo.name'), '') <> 'Bar Count'
      AND COALESCE(json_extract(source.value, '$.state.shortName'), '') <> 'Bar Count'
    ) AS user_sources
  FROM user_chart_settings AS settings,
       json_each(
         json_extract(
           json_extract(settings.studies, '$.layout'),
           '$.charts[0].panes'
         )
       ) AS pane
),
templates AS (
  SELECT
    id,
    user_id,
    updated_at,
    json_object(
      'version', 1,
      'panes', json_group_array(
        json_set(pane_json, '$.sources', json(user_sources))
      )
    ) AS template_json
  FROM source_panes
  WHERE json_array_length(json(user_sources)) > 0
  GROUP BY id, user_id, updated_at
)
INSERT INTO user_indicator_profiles (
  user_id,
  scope,
  template_json,
  template_hash,
  version,
  updated_at
)
SELECT
  user_id,
  'shared',
  template_json,
  'legacy:' || id || ':' || updated_at,
  1,
  updated_at
FROM templates
WHERE 1 = 1
ON CONFLICT(user_id, scope) DO UPDATE SET
  template_json = excluded.template_json,
  template_hash = excluded.template_hash,
  version = excluded.version,
  updated_at = excluded.updated_at;
